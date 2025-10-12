##### tabs

- most of the tabs like settings etc can be displayed in the editor itself 

- the login tab can be a popup window on top of the editor 

- **React-router** will be used to render pages or tabs to editor on click. 

---

## file browser 

- uses **Json** to reseve folder stucture data from the backend
- renders based on children && properties 
- each element will have a type {folder,markdown,(file:hidden | visible, image | markdown)}
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




## AI chat

- chat data will be recieved using json and will be in markdown form.  

- llm will be pre prompted to give results in markdown
- ai jason will have elements 
```
{
    chat {
        user  {
            chat message
        }
        agent{
            chatmessage{
                
            }
            discription{
                detailed description of changes
            }

        }
}
```

incomplete :finger-upwards