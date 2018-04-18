const fs = require('fs');

let file = 'myFile.txt';

// r   : 읽기. 파일이 없으면 예외 발생.
// r+  : 읽기/쓰기. 파일이 없으면 예외 발생.
// rs+ : 읽기/쓰기(동기) 동기식 작업이 필요한 경우 openSync() 호출해야함.
// w   : 쓰기. 파일이 없으면 생성, 파일이 있으면 덮어씀.
// wx  : 'w'와 같음. 경로가 존재하면 실패.
// w+  : 읽기/쓰기. 파일이 없으면 생성, 파일이 있으면 덮어씀.
// wx+ : 'w+'와 같음. 경로가 존재하면 실패.
// a   : 추가. 파일이 없으면 생성.
// ax  : 'a'와 같음. 경로가 존재하면 실패.
// a+  : 읽기/추가. 파일이 없으면 생성.
// ax+ : 'a+'와 같음. 경로가 존재하면 실패.

fs.open(file, 'w+', function(err, fd){
  if(err)
    console.log(err);
  else {
    console.log("File open.");

    fs.writeFile(file, 'Hello', function(err, fd){
      if(err)
        console.log(err);
      else
        console.log("File write.");
    });//writeFile

    fs.readFile(file, 'utf8', function(err, data){
      if(err)
        console.log(err);
      else {
        console.log(data);
        fs.close(fd, function(err) {
          if(err)
            console.log(err);
          else
            console.log("File close.");
        });//close
      }//readFile-else
    });//readFile
  }//open-else
});//open
