function* fizzBuzzGenerator(max) {
  // Tu código acá:

  let number = 1
  while (max ? number <= max : true){ // Me llego un max? Si me llego hago el while mientras number < max, sino hago el while true(infinito)
    if(number % 3===0 && number % 5 ===0){yield "Fizz Buzz"}else
    if(number % 3 ===0){yield "Fizz"}else
    if(number % 5 ===0){yield "Buzz"}else
                       {yield number}
    number++
}

}

module.exports = fizzBuzzGenerator;
