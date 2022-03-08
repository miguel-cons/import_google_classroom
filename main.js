/**
*   Add menu options
*/
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Classroom')
      .addItem('Import Classroom', 'main')
      .addToUi();
}

/**
 * Load JSON file and parameters from SpreadSheet
 */
function main() {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Values'); 
  const configJson = activeSheet.getRange('B1').getValue();
  const configEmail = activeSheet.getRange('B2').getValue();

  // Open file from parameters
  const files = DriveApp.getFilesByName(configJson);
  if (files.hasNext()) {
    var jsondata = files.next().getBlob().getDataAsString()
    var data   = JSON.parse(jsondata);
    var course = createCourse(data, configEmail, activeSheet);
    createDataCourse(course, data, activeSheet);
  } 
  activeSheet.getRange('B4').setValue('Import porcess finished');
}

/**
 * Create a new course in Classroom with the data from Takeout JSON
 * @data - Takeout JSON Object 
 * 
 * Return created course
 */
function createCourse(data, configEmail){
  var course = {};
  course.name = data.name;
  course.section = data.section;
  course.courseState = "ACTIVE";
  course.ownerId = configEmail;

  var createdCourse = Classroom.Courses.create(course);
  return createdCourse;
}

/**
 * Fill the course with Works and Materials
 * @course - Current course object where to import data
 * @data - Takeout JSON data
 */
function createDataCourse(course, data, activeSheet){
  const ID = course.id;
  let createdTopics = [];
  
  // Insert topics - categories
  data.topics.forEach((valorTopic, index) =>  {
    createdTopics.push(Classroom.Courses.Topics.create(valorTopic, ID));
  });

  // Insert materials and works
  data.posts.forEach((post, index) => {
    if ('courseWork' in post){
      let {dueTime, topics, submissions, ...temp} = post.courseWork;
      setPropierties(temp, post, createdTopics, activeSheet);
      Classroom.Courses.CourseWork.create(temp,ID);
    } else if ('courseWorkMaterial' in post){
      let temp = post.courseWorkMaterial;
      setPropierties(temp, post, createdTopics, activeSheet);
      Classroom.Courses.CourseWorkMaterials.create(temp,ID);
    }
  });
}

/**
 * Set common propierties to works an materials
 * @temp - Current object to insert
 * @post - Exported object in JSON
 * @createdTopics - Work or material category
 */
function setPropierties(temp, post, createdTopics, activeSheet){
  if (post.topics && post.topics.length > 0){
    temp.topicId = (createdTopics.find(topic => topic.name == post.topics[0].name)).topicId;  
  }
  temp.state = 'DRAFT';
  temp.creationTime = post.creationTime;
  temp.updateTime = post.updateTime;
  temp.materials = post.materials;

  // Adjust URLs from imported files
  adjustMaterials(temp.materials, activeSheet , temp.title);
}

/**
 * Look for work or material files the new ID and URL
 * @materials - Array de materiales
 */
function adjustMaterials(materials, activeSheet, title){
  let notFound = [];
  if (materials){
    materials.forEach((fichero, index) => {
      if (fichero.driveFile){
        let ficheroEncontrado = DriveApp.getFilesByName(fichero.driveFile.driveFile.title);
        if (ficheroEncontrado.hasNext()){
          ficheroEncontrado = ficheroEncontrado.next();
          fichero.driveFile.driveFile.alternateLink = ficheroEncontrado.getUrl();
          fichero.driveFile.driveFile.id = ficheroEncontrado.getId();
        } else {
          activeSheet.getRange(activeSheet.getLastRow()+1,1).setValue('File: ' + fichero.driveFile.driveFile.title + ' not found. Work / Material: '+ title);
          notFound.push(index);
        }  
      } else if (fichero.youtubeVideo){
        if (!fichero.youtubeVideo.title){
          notFound.push(index);
        }
      } else if (fichero.form){
        activeSheet.getRange(activeSheet.getLastRow()+1,1).setValue('Form: ' + fichero.form.title + ' not insert because is not supported. Work / Material: '+ title);
        notFound.push(index);
      }
    });
    for (let i = notFound.length - 1; i >= 0; i--) 
      materials.splice(notFound[i],1);
  }
}
