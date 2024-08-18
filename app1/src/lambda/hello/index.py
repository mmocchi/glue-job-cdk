from datetime import datetime
from pytz import timezone

def handler(event, context):
    tokyo_dt = datetime.now(timezone('Asia/Tokyo'))

    return {
        'statusCode': 200,
        'body': tokyo_dt.strftime('%Y-%m-%d %H:%M:%S')
    }