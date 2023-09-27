#	Utility commands to setup local development environment

COMPOSE_FILE_PATH = ./docker-compose.yml
COMPOSE_PROJECT_NAME = vst


# clear temp files
clear:
	sudo find . -type d \( -name "node_modules" -or -name "dist" -or -name ".volumes" \) -prune -exec rm -rf {} \;

# setup optional docker environment
up:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) up --detach
clean-up:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) up --detach --build --force-recreate --always-recreate-deps
down:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) down
clean-down:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) down --rmi all --volumes --remove-orphans
rebuild:
	make down && make up