"""
Gemini AI Service - Natural language command execution
"""
import google.generativeai as genai
from typing import Dict, Any, List
import json
import subprocess
from datetime import datetime
from config import get_settings

settings = get_settings()


class GeminiAdminService:
    """Service for executing admin commands via Gemini AI"""
    
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel(settings.gemini_model)
        else:
            self.model = None
    
    async def execute_command(self, user_message: str) -> Dict[str, Any]:
        """
        Execute admin command via Gemini AI
        
        Args:
            user_message: Natural language command from admin
        
        Returns:
            Dict with execution results
        """
        if not self.model:
            return {
                "success": False,
                "error": "Gemini API key not configured. Please set GEMINI_API_KEY environment variable.",
                "timestamp": datetime.utcnow().isoformat()
            }
        
        # Create context for Gemini
        context = self._get_system_context()
        
        # Build prompt
        prompt = f"""You are an AI assistant for the ZeroDay3 Matching AI system. 
You help administrators manage the system through natural language commands.

System Context:
{context}

Available Commands:
1. catalog_info - Get information about products and AI tools
2. add_product - Add a new product to the catalog
3. add_ai_tool - Add a new AI tool to the catalog
4. update_product - Update existing product
5. update_ai_tool - Update existing AI tool
6. delete_product - Remove a product
7. delete_ai_tool - Remove an AI tool
8. system_status - Get system health and statistics
9. run_tests - Execute API tests
10. git_status - Check repository status
11. git_log - View recent commits

User Request: {user_message}

Analyze the request and return a JSON object with:
{{
    "command": "command_name",
    "parameters": {{}},
    "reasoning": "why this command was chosen"
}}

Only return valid JSON, no additional text."""

        try:
            # Generate response from Gemini
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Extract JSON from response
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            command_data = json.loads(response_text.strip())
            
            # Execute the command
            result = await self._execute_admin_command(
                command_data.get("command"),
                command_data.get("parameters", {}),
                command_data.get("reasoning", "")
            )
            
            return result
            
        except json.JSONDecodeError as e:
            return {
                "success": False,
                "error": f"Failed to parse AI response: {str(e)}",
                "raw_response": response_text if 'response_text' in locals() else None,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Command execution failed: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _get_system_context(self) -> str:
        """Get current system context"""
        from app.database import get_data_loader
        
        data_loader = get_data_loader()
        products = data_loader.load_product_catalog()
        tools = data_loader.load_ai_tools_catalog()
        
        return f"""
- Total Products: {len(products)}
- Total AI Tools: {len(tools)}
- API Version: {settings.app_version}
- Matching Framework: 65/35 (Structural/Precision)
"""
    
    async def _execute_admin_command(
        self,
        command: str,
        parameters: Dict[str, Any],
        reasoning: str
    ) -> Dict[str, Any]:
        """Execute the interpreted command"""
        
        result = {
            "success": False,
            "command": command,
            "parameters": parameters,
            "reasoning": reasoning,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        try:
            if command == "catalog_info":
                result.update(await self._get_catalog_info())
            
            elif command == "add_product":
                result.update(await self._add_product(parameters))
            
            elif command == "add_ai_tool":
                result.update(await self._add_ai_tool(parameters))
            
            elif command == "update_product":
                result.update(await self._update_product(parameters))
            
            elif command == "update_ai_tool":
                result.update(await self._update_ai_tool(parameters))
            
            elif command == "delete_product":
                result.update(await self._delete_product(parameters))
            
            elif command == "delete_ai_tool":
                result.update(await self._delete_ai_tool(parameters))
            
            elif command == "system_status":
                result.update(await self._get_system_status())
            
            elif command == "run_tests":
                result.update(await self._run_tests())
            
            elif command == "git_status":
                result.update(await self._git_status())
            
            elif command == "git_log":
                result.update(await self._git_log(parameters))
            
            else:
                result["error"] = f"Unknown command: {command}"
            
        except Exception as e:
            result["error"] = str(e)
        
        return result
    
    async def _get_catalog_info(self) -> Dict[str, Any]:
        """Get catalog information"""
        from app.database import get_data_loader
        
        data_loader = get_data_loader()
        products = data_loader.load_product_catalog()
        tools = data_loader.load_ai_tools_catalog()
        
        return {
            "success": True,
            "data": {
                "products": {
                    "count": len(products),
                    "items": [{"id": p["id"], "name": p["name"], "category": p["category"]} for p in products]
                },
                "ai_tools": {
                    "count": len(tools),
                    "items": [{"id": t["id"], "name": t["name"], "category": t["category"]} for t in tools]
                }
            }
        }
    
    async def _add_product(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new product to catalog"""
        import json
        from pathlib import Path
        
        catalog_path = Path(__file__).parent.parent.parent / "data" / "product_catalog.json"
        
        with open(catalog_path, 'r') as f:
            catalog = json.load(f)
        
        # Validate required fields
        required_fields = ["id", "name", "category", "use_case", "technical_specs", "matching_criteria", "technical_truth"]
        for field in required_fields:
            if field not in parameters:
                return {"success": False, "error": f"Missing required field: {field}"}
        
        catalog["products"].append(parameters)
        
        with open(catalog_path, 'w') as f:
            json.dump(catalog, f, indent=2)
        
        return {"success": True, "message": f"Product '{parameters['name']}' added successfully"}
    
    async def _add_ai_tool(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new AI tool to catalog"""
        import json
        from pathlib import Path
        
        catalog_path = Path(__file__).parent.parent.parent / "data" / "ai_tools_catalog.json"
        
        with open(catalog_path, 'r') as f:
            catalog = json.load(f)
        
        # Validate required fields
        required_fields = ["id", "name", "category", "use_cases", "technical_specs", "matching_criteria", "deployment_guide", "technical_truth"]
        for field in required_fields:
            if field not in parameters:
                return {"success": False, "error": f"Missing required field: {field}"}
        
        catalog["ai_tools"].append(parameters)
        
        with open(catalog_path, 'w') as f:
            json.dump(catalog, f, indent=2)
        
        return {"success": True, "message": f"AI Tool '{parameters['name']}' added successfully"}
    
    async def _update_product(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Update existing product"""
        import json
        from pathlib import Path
        
        product_id = parameters.get("id")
        if not product_id:
            return {"success": False, "error": "Product ID required"}
        
        catalog_path = Path(__file__).parent.parent.parent / "data" / "product_catalog.json"
        
        with open(catalog_path, 'r') as f:
            catalog = json.load(f)
        
        # Find and update product
        for i, product in enumerate(catalog["products"]):
            if product["id"] == product_id:
                catalog["products"][i].update(parameters)
                
                with open(catalog_path, 'w') as f:
                    json.dump(catalog, f, indent=2)
                
                return {"success": True, "message": f"Product '{product_id}' updated successfully"}
        
        return {"success": False, "error": f"Product '{product_id}' not found"}
    
    async def _update_ai_tool(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Update existing AI tool"""
        import json
        from pathlib import Path
        
        tool_id = parameters.get("id")
        if not tool_id:
            return {"success": False, "error": "Tool ID required"}
        
        catalog_path = Path(__file__).parent.parent.parent / "data" / "ai_tools_catalog.json"
        
        with open(catalog_path, 'r') as f:
            catalog = json.load(f)
        
        # Find and update tool
        for i, tool in enumerate(catalog["ai_tools"]):
            if tool["id"] == tool_id:
                catalog["ai_tools"][i].update(parameters)
                
                with open(catalog_path, 'w') as f:
                    json.dump(catalog, f, indent=2)
                
                return {"success": True, "message": f"AI Tool '{tool_id}' updated successfully"}
        
        return {"success": False, "error": f"AI Tool '{tool_id}' not found"}
    
    async def _delete_product(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Delete a product"""
        import json
        from pathlib import Path
        
        product_id = parameters.get("id")
        if not product_id:
            return {"success": False, "error": "Product ID required"}
        
        catalog_path = Path(__file__).parent.parent.parent / "data" / "product_catalog.json"
        
        with open(catalog_path, 'r') as f:
            catalog = json.load(f)
        
        initial_count = len(catalog["products"])
        catalog["products"] = [p for p in catalog["products"] if p["id"] != product_id]
        
        if len(catalog["products"]) == initial_count:
            return {"success": False, "error": f"Product '{product_id}' not found"}
        
        with open(catalog_path, 'w') as f:
            json.dump(catalog, f, indent=2)
        
        return {"success": True, "message": f"Product '{product_id}' deleted successfully"}
    
    async def _delete_ai_tool(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Delete an AI tool"""
        import json
        from pathlib import Path
        
        tool_id = parameters.get("id")
        if not tool_id:
            return {"success": False, "error": "Tool ID required"}
        
        catalog_path = Path(__file__).parent.parent.parent / "data" / "ai_tools_catalog.json"
        
        with open(catalog_path, 'r') as f:
            catalog = json.load(f)
        
        initial_count = len(catalog["ai_tools"])
        catalog["ai_tools"] = [t for t in catalog["ai_tools"] if t["id"] != tool_id]
        
        if len(catalog["ai_tools"]) == initial_count:
            return {"success": False, "error": f"AI Tool '{tool_id}' not found"}
        
        with open(catalog_path, 'w') as f:
            json.dump(catalog, f, indent=2)
        
        return {"success": True, "message": f"AI Tool '{tool_id}' deleted successfully"}
    
    async def _get_system_status(self) -> Dict[str, Any]:
        """Get system status"""
        from app.database import get_data_loader
        
        data_loader = get_data_loader()
        products = data_loader.load_product_catalog()
        tools = data_loader.load_ai_tools_catalog()
        
        return {
            "success": True,
            "data": {
                "status": "operational",
                "version": settings.app_version,
                "framework": "65/35 Logic Framework",
                "products_count": len(products),
                "ai_tools_count": len(tools),
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    
    async def _run_tests(self) -> Dict[str, Any]:
        """Run API tests"""
        try:
            result = subprocess.run(
                ["python3", "test_api.py"],
                cwd="/home/runner/work/zeroday3/zeroday3",
                capture_output=True,
                text=True,
                timeout=30
            )
            
            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr if result.returncode != 0 else None
            }
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Tests timed out after 30 seconds"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def _git_status(self) -> Dict[str, Any]:
        """Get git repository status"""
        try:
            result = subprocess.run(
                ["git", "status", "--short"],
                cwd="/home/runner/work/zeroday3/zeroday3",
                capture_output=True,
                text=True,
                timeout=10
            )
            
            return {
                "success": True,
                "output": result.stdout if result.stdout else "Working tree clean"
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def _git_log(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Get git log"""
        count = parameters.get("count", 5)
        
        try:
            result = subprocess.run(
                ["git", "log", f"-{count}", "--oneline"],
                cwd="/home/runner/work/zeroday3/zeroday3",
                capture_output=True,
                text=True,
                timeout=10
            )
            
            return {
                "success": True,
                "output": result.stdout
            }
        except Exception as e:
            return {"success": False, "error": str(e)}


# Singleton instance
_gemini_service = None


def get_gemini_service() -> GeminiAdminService:
    """Get singleton Gemini service instance"""
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiAdminService()
    return _gemini_service
