import json
import os
from typing import List, Dict
from pathlib import Path


class DataLoader:
    """Load and manage catalog data"""
    
    def __init__(self, data_dir: str = None):
        if data_dir is None:
            # Get the data directory relative to this file
            backend_dir = Path(__file__).parent.parent.parent
            data_dir = backend_dir.parent / "data"
        
        self.data_dir = Path(data_dir)
        self._product_catalog = None
        self._ai_tools_catalog = None
    
    def load_product_catalog(self) -> List[Dict]:
        """Load product catalog from JSON"""
        if self._product_catalog is None:
            catalog_path = self.data_dir / "product_catalog.json"
            with open(catalog_path, 'r') as f:
                data = json.load(f)
                self._product_catalog = data.get('products', [])
        return self._product_catalog
    
    def load_ai_tools_catalog(self) -> List[Dict]:
        """Load AI tools catalog from JSON"""
        if self._ai_tools_catalog is None:
            catalog_path = self.data_dir / "ai_tools_catalog.json"
            with open(catalog_path, 'r') as f:
                data = json.load(f)
                self._ai_tools_catalog = data.get('ai_tools', [])
        return self._ai_tools_catalog
    
    def get_product_by_id(self, product_id: str) -> Dict:
        """Get a specific product by ID"""
        products = self.load_product_catalog()
        for product in products:
            if product['id'] == product_id:
                return product
        return None
    
    def get_tool_by_id(self, tool_id: str) -> Dict:
        """Get a specific AI tool by ID"""
        tools = self.load_ai_tools_catalog()
        for tool in tools:
            if tool['id'] == tool_id:
                return tool
        return None


# Singleton instance
_data_loader = None


def get_data_loader() -> DataLoader:
    """Get singleton data loader instance"""
    global _data_loader
    if _data_loader is None:
        _data_loader = DataLoader()
    return _data_loader
