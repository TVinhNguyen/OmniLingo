IMAGE     ?= omnilingo-content-lesson-generator
TRACK     ?= english_a1_for_vi
UNIT      ?= greetings
LESSON    ?= hello_basics
DRAFT_PATH ?= drafts/english_a1_for_vi/greetings_hello_basics.draft.json
SCRIPTS_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

# ── Environment detection ─────────────────────────────────────────────────────
# Prefer local Python for fast dev iteration (D2 fix).
# Falls back to Docker automatically if local env is not set up.
PYTHON      := python3
HAS_PYDANTIC := $(shell $(PYTHON) -c "import pydantic" 2>/dev/null && echo yes || echo no)
HAS_YAML    := $(shell $(PYTHON) -c "import yaml" 2>/dev/null && echo yes || echo no)

ifeq ($(HAS_PYDANTIC)$(HAS_YAML),yesyes)
  LOCAL_ENV := yes
else
  LOCAL_ENV := no
endif

.PHONY: help \
        docker-build docker-shell docker-schema docker-gen-lesson docker-validate \
        gen-lesson gen-unit gen-track \
        audio-cache audio-dry-run validate publish \
        install-deps

help:
	@echo ""
	@echo "Lesson Generator — Make targets"
	@echo "================================"
	@echo ""
	@echo "  Setup:"
	@echo "    install-deps              Install Python deps locally (pip install -e .)"
	@echo ""
	@echo "  Generate (local Python preferred, Docker fallback):"
	@echo "    gen-lesson   TRACK=$(TRACK) UNIT=$(UNIT) LESSON=$(LESSON)"
	@echo "    gen-unit     TRACK=$(TRACK) UNIT=$(UNIT)"
	@echo "    gen-track    TRACK=$(TRACK)"
	@echo ""
	@echo "  LLM flags:"
	@echo "    GEN_FLAGS=--no-llm       Force rule-based (no GEMINI_API_KEY needed)"
	@echo "    GEN_FLAGS=--dry-run      Test pipeline without real Gemini API calls"
	@echo "    GEN_FLAGS=--concurrency 2  Rate-limit concurrency (gen-unit / gen-track)"
	@echo ""
	@echo "  Audio:"
	@echo "    audio-cache  TRACK=$(TRACK) DRAFT_PATH=$(DRAFT_PATH)"
	@echo "    audio-dry-run  DRAFT_PATH=$(DRAFT_PATH)  (no ELEVENLABS_API_KEY needed)"
	@echo ""
	@echo "  Validate / Publish:"
	@echo "    validate     DRAFT_PATH=$(DRAFT_PATH)"
	@echo "    publish      DRAFT_PATH=drafts/.../file.approved.json [PUBLISH_FLAGS=--publish]"
	@echo ""
	@echo "  Docker helpers:"
	@echo "    docker-build  docker-shell  docker-schema  docker-gen-lesson  docker-validate"
	@echo ""
	@echo "  Local env: $(LOCAL_ENV)  (PYDANTIC=$(HAS_PYDANTIC), YAML=$(HAS_YAML))"
	@echo ""

# ── Setup ─────────────────────────────────────────────────────────────────────

install-deps:
	$(PYTHON) -m pip install -e "$(SCRIPTS_DIR)." --quiet
	@echo "✓ deps installed"

# ── Docker helpers ─────────────────────────────────────────────────────────────

docker-build:
	docker build -t $(IMAGE) $(SCRIPTS_DIR)

docker-shell: docker-build
	docker run --rm -it --network host \
		-v $(CURDIR)/drafts:/app/drafts \
		-e DATABASE_URL -e VOCAB_DATABASE_URL \
		-e CONTENT_SERVICE_URL -e CONTENT_ADMIN_TOKEN \
		-e ELEVENLABS_API_KEY -e GEMINI_API_KEY -e GEMINI_MODEL \
		$(IMAGE) sh

docker-schema: docker-build
	docker run --rm $(IMAGE) python -m common.schema

docker-gen-lesson: docker-build
	docker run --rm --network host -v $(CURDIR)/drafts:/app/drafts \
		-e DATABASE_URL -e VOCAB_DATABASE_URL \
		-e GEMINI_API_KEY -e GEMINI_MODEL \
		$(IMAGE) \
		python -m generators.skeleton \
		  --track $(TRACK) --unit $(UNIT) --lesson $(LESSON) $(GEN_FLAGS)

docker-validate: docker-build
	docker run --rm -v $(CURDIR)/drafts:/app/drafts $(IMAGE) \
		python -m generators.validator $(DRAFT_PATH)

# ── Local Python helpers ─────────────────────────────────────────────────────

define RUN_LOCAL
	cd $(SCRIPTS_DIR) && $(PYTHON) -m $(1) $(2)
endef

define RUN_DOCKER
	$(MAKE) docker-build && \
	docker run --rm --network host -v $(CURDIR)/drafts:/app/drafts \
		-e DATABASE_URL -e VOCAB_DATABASE_URL \
		-e GEMINI_API_KEY -e GEMINI_MODEL \
		$(IMAGE) python -m $(1) $(2)
endef

# ── Main targets (local preferred) ────────────────────────────────────────────

GEN_FLAGS ?=

## Generate a single lesson draft
gen-lesson:
ifeq ($(LOCAL_ENV),yes)
	$(call RUN_LOCAL,generators.skeleton,--track $(TRACK) --unit $(UNIT) --lesson $(LESSON) $(GEN_FLAGS))
else
	@echo "[make] Local Python env not set up — using Docker (run 'make install-deps' for local dev)"
	$(call RUN_DOCKER,generators.skeleton,--track $(TRACK) --unit $(UNIT) --lesson $(LESSON) $(GEN_FLAGS))
endif

## Generate all lessons in a unit
gen-unit:
ifeq ($(LOCAL_ENV),yes)
	$(call RUN_LOCAL,generators.gen_unit,--track $(TRACK) --unit $(UNIT) $(GEN_FLAGS))
else
	@echo "[make] Local Python env not set up — using Docker"
	$(call RUN_DOCKER,generators.gen_unit,--track $(TRACK) --unit $(UNIT) $(GEN_FLAGS))
endif

## Generate all lessons for an entire track
gen-track:
ifeq ($(LOCAL_ENV),yes)
	$(call RUN_LOCAL,generators.gen_track,--track $(TRACK) $(GEN_FLAGS))
else
	@echo "[make] Local Python env not set up — using Docker"
	$(call RUN_DOCKER,generators.gen_track,--track $(TRACK) $(GEN_FLAGS))
endif

## Validate a draft JSON
validate:
ifeq ($(LOCAL_ENV),yes)
	$(call RUN_LOCAL,generators.validator,$(DRAFT_PATH))
else
	$(MAKE) docker-validate
endif

# ── Audio pipeline ─────────────────────────────────────────────────────────────

AUDIO_FLAGS ?=
audio-cache: docker-build
	docker run --rm \
		-v $(CURDIR)/drafts:/app/drafts \
		-v $(CURDIR)/audio-cache:/app/audio-cache \
		-e ELEVENLABS_API_KEY \
		$(IMAGE) python -m generators.audio $(DRAFT_PATH) --track $(TRACK) $(AUDIO_FLAGS)

audio-dry-run: docker-build
	docker run --rm \
		-v $(CURDIR)/drafts:/app/drafts \
		-v $(CURDIR)/audio-cache:/app/audio-cache \
		$(IMAGE) python -m generators.audio $(DRAFT_PATH) --track $(TRACK) --dry-run

# ── Publish ──────────────────────────────────────────────────────────────────

PUBLISH_FLAGS ?=
publish: docker-build
	docker run --rm --network host -v $(CURDIR)/drafts:/app/drafts \
		-e CONTENT_SERVICE_URL -e CONTENT_ADMIN_TOKEN \
		$(IMAGE) python publish.py $(DRAFT_PATH) $(PUBLISH_FLAGS)
