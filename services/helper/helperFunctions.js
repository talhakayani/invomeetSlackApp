exports.findMentions = text => {
  const exp = /<(.*?)>/;
  var test = text.match(exp);
  var finalValue = [];
  while (test) {
    finalValue.push(test[0].split('|')[0].replace('<@', ''));
    text = text.replace(exp, '');
    test = text.match(exp);
  }
  if (!finalValue.lenght) return [];
  return finalValue;
};
