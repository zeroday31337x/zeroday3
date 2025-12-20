# Admin Dashboard - Natural Language Command Interface

## Overview

The ZeroDay3 Admin Dashboard provides a powerful natural language interface for managing the system using Google's Gemini AI. Communicate with your application in plain English and execute complex commands through conversational prompts.

## Features

### Natural Language Commands
Execute administrative tasks by simply describing what you want to do:
- "Show me all products in the catalog"
- "Add a new AI tool for code generation"
- "What's the current system status?"
- "Run the API tests"
- "Show me the last 10 git commits"

### Catalog Management
- **Add Products**: Add new hardware products with full specifications
- **Update Products**: Modify existing product information
- **Delete Products**: Remove products from the catalog
- **AI Tools**: Same operations for AI tools and workflows

### System Monitoring
- **System Status**: Real-time health check and metrics
- **Git Integration**: View repository status and commit history
- **Test Execution**: Run API test suite directly from the dashboard

### Intelligent Interpretation
Gemini AI analyzes your requests and:
1. Determines the appropriate command
2. Extracts necessary parameters
3. Executes the operation
4. Returns formatted results with reasoning

## Setup

### 1. Get Gemini API Key

Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to get your free API key.

### 2. Configure Backend

Create a `.env` file in the `backend` directory:

```bash
# Gemini AI Configuration
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-pro"

# Admin Authentication
ADMIN_SECRET_KEY="your-secret-key-change-in-production"
ADMIN_ALGORITHM="HS256"
ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

New dependencies added:
- `google-generativeai==0.3.2` - Gemini AI SDK
- `python-jose[cryptography]==3.3.0` - JWT authentication
- `passlib[bcrypt]==1.7.4` - Password hashing

### 4. Start the Application

**Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 5. Access Admin Dashboard

Navigate to `http://localhost:3000/admin`

**Default Credentials:**
- Token: `your-secret-key-change-in-production`

⚠️ **Change this in production!**

## API Endpoints

### POST `/api/admin/execute`
Execute natural language commands

**Headers:**
```
X-Admin-Token: your-admin-token
Content-Type: application/json
```

**Request:**
```json
{
  "message": "Show me all products in the catalog"
}
```

**Response:**
```json
{
  "success": true,
  "command": "catalog_info",
  "reasoning": "User wants to see catalog information",
  "data": {
    "products": { "count": 3, "items": [...] },
    "ai_tools": { "count": 5, "items": [...] }
  },
  "timestamp": "2024-12-19T04:00:00"
}
```

### GET `/api/admin/status`
Get admin dashboard status

**Response:**
```json
{
  "status": "operational",
  "gemini_configured": true,
  "version": "1.0.0",
  "features": {
    "natural_language_commands": true,
    "catalog_management": true,
    "system_monitoring": true,
    "git_integration": true
  }
}
```

### GET `/api/admin/commands`
List available commands

**Response:**
```json
{
  "commands": [
    {
      "name": "catalog_info",
      "description": "Get information about products and AI tools",
      "example": "Show me all products"
    },
    ...
  ]
}
```

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `catalog_info` | Get catalog information | "Show me all products" |
| `add_product` | Add new product | "Add Dell XPS 15 laptop" |
| `add_ai_tool` | Add new AI tool | "Add Google Gemini as an AI tool" |
| `update_product` | Update product | "Update MacBook Pro price" |
| `update_ai_tool` | Update AI tool | "Update GPT-4 capabilities" |
| `delete_product` | Delete product | "Remove Galaxy Book4" |
| `delete_ai_tool` | Delete AI tool | "Delete Zapier AI" |
| `system_status` | System health | "What's the system status?" |
| `run_tests` | Execute tests | "Run the API tests" |
| `git_status` | Repository status | "Show git status" |
| `git_log` | View commits | "Show last 10 commits" |

## Security

### Authentication
- Token-based authentication via `X-Admin-Token` header
- Configurable secret key in environment variables
- No authentication for health check endpoints

### Best Practices
1. **Change Default Token**: Never use default token in production
2. **Use HTTPS**: Encrypt traffic in production
3. **Rotate Keys**: Periodically update admin tokens
4. **Audit Logs**: Monitor admin command execution
5. **Rate Limiting**: Implement rate limits on admin endpoints

### Environment Variable Security
```bash
# Generate secure token
import secrets
print(secrets.token_urlsafe(32))
```

## Troubleshooting

### Gemini Not Configured
**Symptom**: Commands return "Gemini API key not configured"

**Solution**: Set `GEMINI_API_KEY` in backend `.env` file

### Authentication Failed
**Symptom**: 401 Unauthorized or 403 Forbidden

**Solution**: Verify `X-Admin-Token` matches `ADMIN_SECRET_KEY`

### Command Not Recognized
**Symptom**: "Unknown command" error

**Solution**: 
- Check command examples in `/api/admin/commands`
- Be more specific in your request
- Use simpler language

### Gemini Rate Limits
**Symptom**: API quota exceeded errors

**Solution**:
- Free tier has limits (60 requests/minute)
- Implement request caching
- Upgrade to paid tier if needed

## Advanced Usage

### Custom Commands

Add new commands by extending `gemini_admin.py`:

```python
async def _custom_command(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Your custom command logic"""
    return {"success": True, "message": "Command executed"}
```

Register in `_execute_admin_command`:
```python
elif command == "custom_command":
    result.update(await self._custom_command(parameters))
```

### Batch Operations

Execute multiple commands in sequence:
```
"First show me all products, then run the tests, then show git status"
```

Gemini will break this down into individual commands.

### Context Awareness

Gemini maintains context within a conversation:
```
User: "Show me all products"
AI: [displays products]
User: "Delete the first one"
AI: [deletes first product from previous list]
```

## Performance

- **Response Time**: ~1-3 seconds with Gemini
- **Throughput**: Limited by Gemini API quotas
- **Caching**: Responses not cached (real-time data)

## Limitations

1. **Gemini Required**: Natural language features need API key
2. **English Only**: Optimized for English commands
3. **Command Scope**: Limited to predefined operations
4. **No Undo**: Commands execute immediately (be careful!)

## Future Enhancements

- [ ] Multi-language support
- [ ] Command history and replay
- [ ] Scheduled command execution
- [ ] Webhook integrations
- [ ] Voice command support
- [ ] Audit trail and logging
- [ ] Role-based access control
- [ ] Command approval workflow

## Support

For issues or questions:
- Check logs in terminal output
- Review API documentation at `/docs`
- Test with simple commands first
- Verify environment variables are set

---

**"We don't patch the past; we optimize the drive."**

*ZeroDay3 © 2024 | The Honesty Vector for the Synthetic Age*
