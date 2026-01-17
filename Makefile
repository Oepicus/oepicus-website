# Makefile for Oepicus multi-site deployment
#
# This Makefile handles deploying the Jekyll site to two different remotes,
# each with its own CNAME and _config.yml, using only Git.

.PHONY: all help deploy-com deploy-us build-com build-us setup-com setup-us clean

# VARIABLES
JEKYLL_ENV ?= production
CONFIG_DIR = _configs
SITE_DIR = _site

# Save original config and CNAME to restore them later
BACKUP_CONFIG = _config.yml.bak
BACKUP_CNAME = CNAME.bak

# Get remote URLs from the main repo's git config
# This allows the script to work without hardcoding URLs.
REMOTE_URL_COM := $(shell git remote get-url oepicus_com)
REMOTE_URL_US := $(shell git remote get-url oepic_us)

# Default target
all: help

help:
	@echo "------------------------------------------------------------------------"
	@echo "Oepicus Multi-Site Deployment (Git-based)"
	@echo "------------------------------------------------------------------------"
	@echo "Available commands:"
	@echo "  make help          - Show this help message."
	@echo "  make deploy-com    - Build and deploy the site to the oepicus_com remote."
	@echo "  make deploy-us     - Build and deploy the site to the oepic_us remote."
	@echo "  make build-com     - Build the oepicus.com site locally in ./_site."
	@echo "  make build-us      - Build the oepic.us site locally in ./_site."
	@echo "  make clean         - Restore original config files if a build failed."
	@echo "------------------------------------------------------------------------"

# --- DEPLOYMENT TARGETS ---

# Deploy to oepicus.com
deploy-com: setup-com
	@echo "--> Deploying to oepicus_com remote..."
	git add . && \
	git commit -m "Deploy site to oepicus.com" && \
	git push --force "$(REMOTE_URL_COM)" main
	@echo "--> Deployment to oepicus_com complete."
# 	@$(MAKE) clean

# Deploy to oepic.us
deploy-us: setup-us
	@echo "--> Deploying to oepic_us remote..."
	git add . && \
	git commit -m "Deploy site to oepic.us" && \
	git push --force "$(REMOTE_URL_US)" main
	@echo "--> Deployment to oepic_us complete."
# 	@$(MAKE) clean

# --- BUILD TARGETS ---

# Build for oepicus.com
build-com: setup-com
	@echo "--> Building site for oepicus.com..."
# 	@JEKYLL_ENV=$(JEKYLL_ENV) bundle exec jekyll build

# Build for oepic.us
build-us: setup-us
	@echo "--> Building site for oepic.us..."
# 	@JEKYLL_ENV=$(JEKYLL_ENV) bundle exec jekyll build

# --- SETUP & CLEANUP ---

setup-com:
	@echo "--> Setting up configuration for oepicus.com..."
	@cp _config.yml $(BACKUP_CONFIG) 2>/dev/null || true
	@cp CNAME $(BACKUP_CNAME) 2>/dev/null || true
	@cp $(CONFIG_DIR)/oepicus.com/_config.yml _config.yml
	@cp $(CONFIG_DIR)/oepicus.com/CNAME CNAME

setup-us:
	@echo "--> Setting up configuration for oepic.us..."
	@cp _config.yml $(BACKUP_CONFIG) 2>/dev/null || true
	@cp CNAME $(BACKUP_CNAME) 2>/dev/null || true
	@cp $(CONFIG_DIR)/oepic.us/_config.yml _config.yml
	@cp $(CONFIG_DIR)/oepic.us/CNAME CNAME

clean:
	@echo "--> Cleaning up and restoring original files..."
	@mv -f $(BACKUP_CONFIG) _config.yml 2>/dev/null || true
	@mv -f $(BACKUP_CNAME) CNAME 2>/dev/null || true
	@echo "--> Cleanup complete."