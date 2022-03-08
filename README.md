# Import Google Classroom
Import a Google Classroom from Google Takeout JSON

This Google App Script allows you to import a Classroom from an old Google Wokspace into a new one. The script needs a Google Spreadsheet with some params like is showed in the image.
JSON File: This file is gnereated in the Google Takeout process, so you need to make a Takeout at least of your Classrooms and files from Drive, not Classroom folder in Drive, the folders where the original files was when you created the classroom.
New user email: Your new domain email.
Name of sheet: Values !IMPORTANT.

The script will fill the spreadsheet with those files not found so you can look for them and insert later in the work / material appropriate. Also it shows a message whe everything has finished.

IMPORTANT: Maybe some works or materials could appear empty and not get any error, well, is possible that Google takeout omitted them in the backup process, to check it, you can open the JSON file and look for the work /material title that is empty to check if is really empty or with materials.

## HOW TO PROCEED

1. Create a new folder inyour new domain Google Drive.
2. Upload to this folder the takeout JSON file from your Classroom backup (takeout).
3. Upload to your new Google Drive the files and folders from your old domain, you can upload all of them in a new folder in Drive.
4. Create a new Google Spreadsheet, give it a representative name.
5. Open the spreadsheet, change sheet name to "Values" like in the image. 
6. Write the rest of params with your JSON file and your new email. Under the "File not found" cell will appear the not found files.
7. Go to the Extensions menu and click in App Script.
8. Copy and paste the code from the file "main.js". Give a name to your script and save it.
9. Now you can see a new menu option called Classroom and inside and option called Importa Classroom, click it to start the process.
10. That's all. I hope this can help you :-))

![image](https://github.com/miguel-cons/import_google_classroom/blob/main/Importar%20Classroom.png)
