
**the json structure is only for understanding. please see json file*


## file browser 

- uses **Json** to reseve folder stucture data from the backend
- renders based on children && properties 
- each element will have a type 
```

{
  "folders": [
    {
      "type": "folder | markdown | img",
      "visible": "true | false",
      "children": null
    },
    {
      "type": "folder | markdown | img",
      "visible": "true | false",
      "children": [
        {
          "type": "folder | markdown | img",
          "visible": "true | false",
          "children": null
        }
      ]
    }
  ]
}

```
- currently supported files are various image formats eg jpg , png etc
- all files will be converted to a specifi resolution range. 
- all files will be converted to jpg with 80% quality (best file size to quality ratio)
- file uplaod will happen directly through editor and files will be stored in same folder as the md file. 
- user will only see the file in folderr structur and will not see other files (makes ui clean and user doesnot need to see them any way)

## Editor

- the editor uses blocknote to setup a markdown editor 
- pages will be loaded in the editor using react router and will be auto saved every 10 seconds. 

- every 10s all the markdown with newly added files etc will be sent to the backend 

- from the data sent to backend there will be a copy stored locally for undo functionality

---


## AI chat

- chat data will be recieved using json and will be in markdown form.  

- llm will be pre prompted to give results in markdown

- There should be an option to perform "create" new chat, older chats will be stored in chat history dropdown like we have in ChatGPT interface

- ai jason will have elements 

**recieved*
```
[
    {
        type : ai-response
        description : (markdown data)
        changes : (markdown data)
    }
]


```

**sent*

```
[
    {
        type : user-message
        description/chat : (markdown data)

        context : [
            { 
                file :(markdown file) **currently opened*,
                previous-chats : (chat-history)
            }
        ]

    }
]


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

