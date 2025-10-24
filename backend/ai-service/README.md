# AI Service



## Model Generation

The AI Service use [datamodel-code-generator](https://github.com/koxudaxi/datamodel-code-generator) for generating Pydantic Models. You can run the code generator by running:
```bash
uv run datamodel-codegen --input-file-type openapi --input ../../api-specs/openapi.yaml --output src/model.py --output-model-type pydantic_v2.BaseModel --snake-case-field
```

## TODO:
- [ ] adjust command's --input and --output to match project structure