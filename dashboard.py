
import streamlit as st
import requests
import pandas as pd
import plotly.express as px
import json

st.set_page_config(layout="wide")
st.title("📊 Mantra Bot Analytics Dashboard")

# Fetch AI blueprint
blueprint_response = requests.get("http://127.0.0.1:5000/api/ai-dashboard-blueprint")
blueprint = blueprint_response.json()

# Fetch metrics
metrics = requests.get("http://127.0.0.1:5000/api/metrics").json()

# ----------------------------
# Render KPIs Dynamically
# ----------------------------

if "kpis" in blueprint:
    cols = st.columns(len(blueprint["kpis"]))

    for i, kpi in enumerate(blueprint["kpis"]):
        value = metrics.get(kpi, "N/A")
        cols[i].metric(kpi.replace("_", " ").title(), value)

st.divider()

# ----------------------------
# Render Charts Dynamically
# ----------------------------

for chart in blueprint.get("charts", []):

    chart_type = chart.get("type")
    data_key = chart.get("data_key")
    title = chart.get("title")

    if data_key not in metrics:
        continue

    data = metrics[data_key]

    if isinstance(data, dict):
        df = pd.DataFrame(
            list(data.items()),
            columns=["Category", "Value"]
        )
    else:
        continue

    if chart_type == "bar":
        fig = px.bar(df, x="Category", y="Value", title=title)
    elif chart_type == "pie":
        fig = px.pie(df, names="Category", values="Value", title=title)
    elif chart_type == "line":
        fig = px.line(df, x="Category", y="Value", title=title)
    else:
        fig = px.bar(df, x="Category", y="Value", title=title)

    st.plotly_chart(fig, use_container_width=True)