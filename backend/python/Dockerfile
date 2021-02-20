FROM python:3.7

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . ./app

EXPOSE 5000
ENTRYPOINT ["python", "server.py"]
