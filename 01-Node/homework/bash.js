    // Output un prompt
    process.stdout.write('prompt > ');
    // El evento stdin 'data' se dispara cuando el user escribe una línea
    process.stdin.on('data', function (data) {
      var cmd = data.toString().trim(); // remueve la nueva línea
      
        let cmd = args.shift();
      if(cmd === 'echo'){
        process.stdout.write(args.join(""));
      }


      process.stdout.write('\nprompt > ');
    });