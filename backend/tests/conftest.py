import pytest
from unittest.mock import MagicMock, patch
import sys
import os

# Add backend to path so we can import main and model
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

@pytest.fixture
def mock_classifier():
    # Patch the methods of the singleton instance in model.py
    with patch('model.classifier.load_models') as mock_load, \
         patch('model.classifier.predict') as mock_predict:
        mock_load.return_value = None
        mock_predict.return_value = [
            {"date": "1/20", "category": "Food & Dining", "cost": 57.80, "desc": "feetures socks"}
        ]
        yield mock_predict

@pytest.fixture
def client():
    from fastapi.testclient import TestClient
    from main import app
    with TestClient(app) as c:
        yield c

def pytest_addoption(parser):
    parser.addoption(
        "--run-smoke", action="store_true", default=False, help="run smoke tests"
    )

def pytest_collection_modifyitems(config, items):
    if config.getoption("--run-smoke"):
        # --run-smoke given in cli: do not skip smoke tests
        return
    skip_smoke = pytest.mark.skip(reason="need --run-smoke option to run")
    for item in items:
        if "smoke" in item.keywords:
            item.add_marker(skip_smoke)
