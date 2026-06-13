from sqlalchemy import create_engine

engine = create_engine(
    "postgresql://sighvidyut:sai111007!@localhost:5432/instagram_dashboard"
)

try:
    conn = engine.connect()
    print("CONNECTED")
    conn.close()
except Exception as e:
    print("ERROR:")
    print(e)