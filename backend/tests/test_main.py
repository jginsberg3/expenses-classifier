def test_read_root(client, mock_classifier):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Budget Classifier API is running"}

def test_classify_text_success(client, mock_classifier):
    test_input = "- 1/20 $57.80 feetures socks"
    response = client.post("/classify", json={"text": test_input})
    
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) == 1
    assert data["items"][0]["desc"] == "feetures socks"
    
    # Verify mock was called
    mock_classifier.assert_called_once_with(test_input)

def test_classify_text_empty(client, mock_classifier):
    response = client.post("/classify", json={"text": ""})
    assert response.status_code == 400
    assert response.json()["detail"] == "Text cannot be empty"

def test_classify_text_invalid_json(client, mock_classifier):
    response = client.post("/classify", json={})
    assert response.status_code == 422 # Pydantic validation error
