import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ensure the backend is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app

@pytest.mark.smoke
def test_classify_smoke():
    """
    A 'real' test that does NOT use the mock_classifier fixture.
    It will load the real model files from the 'models' directory.
    """
    with TestClient(app) as client:
        test_input = "- 1/20 $57.80 feetures socks"
        response = client.post("/classify", json={"text": test_input})
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify we got a real classification back
        assert "items" in data
        assert len(data["items"]) > 0
        assert data["items"][0]["desc"] == "feetures socks"
        # The real model should categorize 'socks' as 'Shopping' or similar
        assert data["items"][0]["category"] in ["Shopping", "Clothing", "Clothes", "Personal Care"] 
        # Note: Depending on the exact model training, this might vary, 
        # but we check if it's a known category.
