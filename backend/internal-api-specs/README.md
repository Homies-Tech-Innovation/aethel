### Internal API Specification

## Swagger Editor
The root directory docker compose file includes a Swagger Editor for API specification editing and testing. You can access the Swagger Editor at [http://localhost:8080](http://localhost:8080) after starting the Docker containers using Docker Compose. 

1. **In the root directory (`aethel/`), ensure your `.env` file includes the following line to point to the internal API specs:**
   ```bash
   OPENAPI_SPEC_PATH=./backend/internal-api-specs/openapi.yaml
   ```
2. **Start the Swagger Editor from root project directory:**
   ```bash
   docker compose  up -d swagger-editor --build
   ```
3. **Access the Swagger Editor:**
   Open your web browser and navigate to [http://localhost:8080](http://localhost:8080) to use the Swagger Editor with the internal API specifications mounted.
4. **Modifying API Specs:**
   - Make changes to the OpenAPI specification files located in `backend/internal-api-specs/`. Reload the Swagger Editor to see your changes reflected.
   - You can also edit the `openapi.yaml` directly from the Swagger Editor interface. However, remember to save your changes back to the host filesystem manually.

## Swagger UI
The Swagger UI is also included in the Docker Compose setup for visualizing and interacting with the API documentation. You can access the Swagger UI at [http://localhost:8081](http://localhost:8081). 


1. **In the root directory (`aethel/`), ensure your `.env` file includes the following line to point to the internal API specs:**
   ```bash
   OPENAPI_SPEC_PATH=./backend/internal-api-specs/openapi.yaml
   ```
2. **Start the Swagger UI from root project directory:**
   ```bash
   docker compose  up -d swagger-ui --build
   ```
3. **Access the Swagger UI:**
   Open your web browser and navigate to [http://localhost:8081](http://localhost:8081) to use the Swagger UI with the internal API specifications mounted.


