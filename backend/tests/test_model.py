import pytest
import pandas as pd
from model import BudgetClassifier

@pytest.fixture
def classifier():
    return BudgetClassifier()

def test_parse_expenses_basic(classifier):
    text = "- 1/20 $57.80 feetures socks"
    df = classifier.parse_expenses(text)
    
    assert len(df) == 1
    assert df.iloc[0]['date'] == "1/20"
    assert df.iloc[0]['cost'] == 57.80
    assert df.iloc[0]['desc'] == "feetures socks"

def test_parse_expenses_multiple_lines(classifier):
    text = """
    - 1/20 $57.80 feetures socks
    - 1/21 $10.00 coffee
    """
    df = classifier.parse_expenses(text)
    
    assert len(df) == 2
    assert df.iloc[1]['desc'] == "coffee"
    assert df.iloc[1]['cost'] == 10.00

def test_parse_expenses_income(classifier):
    # Testing that +$ sign results in negative cost (income)
    text = "- 1/21 +$5 Venmo from Bing for lunch"
    df = classifier.parse_expenses(text)
    
    assert len(df) == 1
    assert df.iloc[0]['cost'] == -5.0
    assert "Venmo from Bing" in df.iloc[0]['desc']

def test_parse_expenses_invalid_line(classifier):
    text = "this is not a valid expense line"
    df = classifier.parse_expenses(text)
    assert len(df) == 0

def test_parse_expenses_with_commas(classifier):
    text = "- 1/22 $1,200.50 rent"
    df = classifier.parse_expenses(text)
    assert len(df) == 1
    assert df.iloc[0]['cost'] == 1200.50
