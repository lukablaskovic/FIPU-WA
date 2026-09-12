.DEFAULT_GOAL := help
.PHONY: help check-script pdf upload sync

# Keep the lesson argument out of shell code.
export SCRIPT

help:
	@echo 'make pdf SCRIPT=WA1     Generate this lesson PDF locally'
	@echo 'make upload SCRIPT=WA1  Upload this lesson Markdown and existing PDF to Drive'
	@echo 'make sync SCRIPT=WA1    Generate PDF, then upload both files on success'
	@echo 'Choose SCRIPT=WA1 through WA7. These commands do not commit or push.'

check-script:
	@test -n "$$SCRIPT" || { echo 'Choose a lesson, e.g. make sync SCRIPT=WA1'; exit 1; }

pdf: check-script
	node script-patcher/render-pdfs.mjs --script "$$SCRIPT"

upload: check-script
	script-patcher/.venv/bin/python script-patcher/index.py --script "$$SCRIPT"

sync: pdf
	$(MAKE) upload
