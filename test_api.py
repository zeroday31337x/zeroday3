#!/usr/bin/env python3
"""
Simple test script to verify ZeroDay3 Matching AI API endpoints
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("Testing health check endpoint...")
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    print("✓ Health check passed")
    return True

def test_products_catalog():
    """Test products catalog endpoint"""
    print("\nTesting products catalog endpoint...")
    response = requests.get(f"{BASE_URL}/api/catalog/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3  # We have 3 products
    print(f"✓ Products catalog returned {len(data)} products")
    return True

def test_ai_tools_catalog():
    """Test AI tools catalog endpoint"""
    print("\nTesting AI tools catalog endpoint...")
    response = requests.get(f"{BASE_URL}/api/catalog/tools")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5  # We have 5 AI tools
    print(f"✓ AI tools catalog returned {len(data)} tools")
    return True

def test_company_matching():
    """Test company matching endpoint"""
    print("\nTesting company matching endpoint...")
    payload = {
        "friction_point": "Customer support latency issues with repetitive questions",
        "company_size": "medium",
        "industry": "SaaS"
    }
    response = requests.post(f"{BASE_URL}/api/match/company", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
    print(f"✓ Company matching returned {len(data['recommendations'])} recommendations")
    print(f"  Top match: {data['recommendations'][0]['tool_name']} ({data['recommendations'][0]['match_score']:.2%})")
    return True

def test_individual_matching():
    """Test individual matching endpoint"""
    print("\nTesting individual matching endpoint...")
    payload = {
        "need": "Best laptop for machine learning development and local model training",
        "budget_range": "premium",
        "ecosystem_preference": "agnostic"
    }
    response = requests.post(f"{BASE_URL}/api/match/individual", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
    print(f"✓ Individual matching returned {len(data['recommendations'])} recommendations")
    print(f"  Top match: {data['recommendations'][0]['product_name']} ({data['recommendations'][0]['match_score']:.2%})")
    return True

def main():
    """Run all tests"""
    print("=" * 60)
    print("ZeroDay3 Matching AI - API Tests")
    print("=" * 60)
    
    tests = [
        test_health,
        test_products_catalog,
        test_ai_tools_catalog,
        test_company_matching,
        test_individual_matching
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"✗ {test.__name__} failed: {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    print("=" * 60)
    
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
