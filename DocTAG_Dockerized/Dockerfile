FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m pip install --no-cache-dir git+https://github.com/OntoGene/PyBioC.git
COPY . /code/


