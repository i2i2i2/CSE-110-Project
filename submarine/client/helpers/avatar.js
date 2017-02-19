Template.registerHelper('avatar', function (profileSeed) {
  // map string to number array
  if (!profileSeed) return;

  var numArr = profileSeed.split("").map(char => {
    var num = char.charCodeAt(0);
    if (num < 65) {
      return (num - 48)/62;
    } else if (num < 97) {
      return (num - 55)/62;
    } else {
      return (num - 61)/62;
    }
  });

  // generate rgb color
  var num = Math.ceil((numArr[0] + numArr[1]/10) / 1.1 * 12);
  var h = numArr[2];
  var s = 0.7 * numArr[3];
  var v = 1 - 0.7 * numArr[4];
  var main = HSVtoRGB(h, s, v);

  if (numArr[5] < 0.33)
    var h1 = (h + 0.5) % 1;
  else if (numArr[5] < 0.67)
    var h1 = (h + 0.1) % 1;
  else
    var h1 = h;
  var s1 = 0.3 * numArr[6];
  var v1 = 1 - 0.3 * numArr[7];
  var sub = HSVtoRGB(h1, s1, v1);
  colorDist(main, sub)

  var svg =
      '<svg style="' + "--main:" + toBase16Color(main) + ";--sub:" + toBase16Color(sub) + ';" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">'
    +   '<use href="/avatar' + num + '.svg#avatar"></use>'
    + '</svg>';

  return Spacebars.SafeString(svg);

  function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }

    return { r: Math.round(r * 255),
             g: Math.round(g * 255),
             b: Math.round(b * 255)};
  }

  function toBase16Color(color) {
    function padding(str) {
      if (str.length == 1) return "0" + str;
      else return str;
    }
    return "#" + color.r.toString(16)
               + color.g.toString(16)
               + color.b.toString(16);
  }

  function colorDist(color1, color2) {
    var bright1 = Math.sqrt(.241 * color1.r * color1.r
                          + .691 * color1.g * color1.g
                          + .068 * color1.b * color1.b);
    var bright2 = Math.sqrt(.241 * color2.r * color2.r
                          + .691 * color2.g * color2.g
                          + .068 * color2.b * color2.b);
    if (bright1 - bright2 > 100) {
      return;
    } else if (bright1 - bright2 < -100) {
      return;
    } else if (bright1 - bright2 > 0) {
      color2.r -= 6;
      if (color2.r < 0) color2.r = 0;
      color2.g -= 14;
      if (color2.g < 0) color2.g = 0;
      color2.b -= 2;
      if (color2.b < 0) color2.b = 0;
      color1.r += 6;
      if (color1.r > 255) color1.r = 255;
      color1.g += 14;
      if (color1.g > 255) color1.g = 255;
      color1.b += 2;
      if (color1.b > 255) color1.b = 255;
      return;
    } else {
      color1.r -= 6;
      if (color1.r < 0) color1.r = 0;
      color1.g -= 14;
      if (color1.g < 0) color1.g = 0;
      color1.b -= 2;
      if (color1.b < 0) color1.b = 0;
      color2.r += 6;
      if (color2.r > 255) color2.r = 255;
      color2.g += 14;
      if (color2.g > 255) color2.g = 255;
      color2.b += 2;
      if (color2.b > 255) color2.b = 255;
      return;
    }
  }
});
