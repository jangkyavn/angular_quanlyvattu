import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightSearchPipe implements PipeTransform {
  transform(value: any, args: any): any {
    if (args && value) {
      value = String(value); // make sure its a string

      if (!isNaN(args)) {
        args = parseInt(args, 0);
        args = args.toLocaleString('en-us');
      }

      const startIndex = value.toLowerCase().trim().indexOf(args.toLowerCase().trim());

      if (startIndex !== -1) {
        const endLength = args.length;
        const matchingString = value.substr(startIndex, endLength);
        return value.replace(matchingString, '<span class="mark-search">' + matchingString + '</span>');
      } else {
        const tempVavlue = this.toUnSign(value);
        const tempArgs = this.toUnSign(args);

        const startIndex2 = tempVavlue.toLowerCase().trim().indexOf(tempArgs.toLowerCase().trim());
        if (startIndex2 !== -1) {
          const endLength2 = tempArgs.length;
          const matchingString = value.substr(startIndex2, endLength2);
          return value.replace(matchingString, '<span class="mark-search">' + matchingString + '</span>');
        }
      }
    }
    return value;
  }

  toUnSign(input: string) {
    if (input === undefined || input === '') {
      return '';
    }
    input = input.replace(/đ/gi, 'd');
    return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
