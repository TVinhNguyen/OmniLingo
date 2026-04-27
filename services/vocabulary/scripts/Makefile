PYTHON ?= python3

.PHONY: import-jp import-cn import-en import-all enrich-vn \
        download-jp download-cn download-en

import-jp:
	$(PYTHON) import_jmdict.py --skip-missing

import-cn:
	$(PYTHON) import_cedict.py --skip-missing

import-en:
	$(PYTHON) import_wordnet.py

import-all: import-jp import-cn import-en

enrich-vn:
	$(PYTHON) enrich_vn_translations.py

download-jp:
	./download.sh jmdict

download-cn:
	./download.sh cedict

download-en:
	./download.sh wordnet
