

## file browser

- uses **Json** to reseve folder stucture data from the backend
- renders based on children && properties


```

{
  "folders": [
    {
      "id" : "string"
      "name": "string",
      "type": "folder | document",      
      "children": null
    },
    {
      "id" : "string"
      "name": "string",
      "type": "folder | document",      
      "children": {
                    "id" : "string"
                    "name": "string",
                    "type": "folder | document",                  
                    "children": null
                  }
      
    }     
  ]
}

```

- currently supported files are various image formats eg jpg , png etc

- user will only see the file in folderr structure and will not see other files (makes ui clean and user does not need to see them any way)

### functions

#### handleClick 

- opens folders or loads files

```tsx
const handleClick = () => {

if (type == folder){
  //set show children true or flase
}
else {
  //load file to edditor
}

}
```



## Editor

- the editor uses blocknote to setup a markdown editor
- pages will be loaded in the editor using react router 

- frontend requests a file when user clicks on it and gets this response

```ts
initialContent = document.content
```

- pages will be auto saved every 4 seconds.


- every 4 second all the markdown with newly added files etc will be sent to the backend

- from the data sent to backend there will be a copy stored locally for undo functionality [This can introduce more complexity like versioning, better remove it]   OR [stoered copy can help faster with faster undo and no management. undo history clears itself ans it is stored in frontend only]


---

## AI chat

- chat data will be recieved using json and will be in markdown form.



- llm will be pre prompted to give results in markdown

- There should be an option to perform "create" new chat, older chats will be stored in chat history dropdown like we have in ChatGPT interface

- ai jason will have elements

\*_recieved_

```
code here
```

\*_sent_

```
code here
```

---

## Settings

### Acount

- account settings

### Guide

- given the simplicity of the tool to user we dont want them to go on a different webpage for a guide.

- guide can be another md file which is not editable and can be rendered as another tab in the editor

#### tabs

- most of the tabs like settings etc can be displayed in the editor itself

- the login tab can be a popup window on top of the editor

- **React-router** will be used to render pages or tabs to editor on click.

## for future (not in mvp)

- light mode
- mobile version
- video/gif support
- customizable ui

### mobile version

- on small screens we show message like mobile version not supported.
