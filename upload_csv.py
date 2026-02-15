import os
import csv
from dotenv import load_dotenv
from supabase import create_client, Client

# 환경변수 로드
load_dotenv()

url = os.getenv("https://mhfazebnnvdhemjrgokq.supabase.co")
key = os.getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZmF6ZWJubnZkaGVtanJnb2txIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUzOTMwMCwiZXhwIjoyMDgyMTE1MzAwfQ.quJJjmAtOr1qNgx44UMSHkKcR0evrfQPOtIj12J7ZFQ")

if not url or not key:
    raise ValueError("❌ SUPABASE_URL 또는 SUPABASE_SERVICE_KEY가 .env에 없습니다.")

supabase: Client = create_client(url, key)
print("✅ Supabase 연결 성공")

# 업로드할 CSV 파일 목록 (순서대로)
csv_files = [
    "csv_files/1111.csv",
    "csv_files/2222.csv",
    "csv_files/3333.csv"
]

for file_path in csv_files:
    print(f"\n🚀 업로드 시작: {file_path}")
    rows = []
    try:
        with open(file_path, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)

        # Supabase에 업로드
        result = supabase.table("dictionary_lines").insert(rows).execute()
        print(f"✅ 업로드 성공: {file_path} - {len(rows)}개 항목")
    except Exception as e:
        print(f"❌ 업로드 실패: {file_path}")
        print("에러:", e)
