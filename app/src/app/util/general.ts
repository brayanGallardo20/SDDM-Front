export function getHash(value: string): number {
    let hash = 5381;
    value = value.toUpperCase();
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) + hash + value.charCodeAt(i);
    }
    return hash;
  }


  export function validPattern(f: KeyboardEvent, pattern: any) {

    try {
      const h = pattern
      var a = f.which ? f.which : f.keyCode;
      console.log("ad:",f)

      if (a === 13) {
        return;
      }
      if (a === 8 || a === 127) {
       return ;
      }
      var c = f.key;
      var g = new RegExp(h);
      var b = g.test(c);
      console.log("paseeee",c)
      console.log("pattern",g)
      if (b) {
        console.log("verdadero",c)
        // return true;
      } else {
        f.preventDefault();
      }
    } catch (d) {
      f.preventDefault();
      console.log(d);
    }

  }