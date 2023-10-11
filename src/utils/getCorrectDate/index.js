export default function getCorrectDate( date ){

    const _date = new Date( date );

    const getCorrectMonth = ( value ) => {
        value += 1;
        if ( value < 10 ){
            return `0${value}`;
        }
        return value;
    }
    const getCorrectValue = ( value ) => {
        if ( value < 10 ){
            return `0${value}`;
        }
        return value;
    }

    if ( _date !== undefined ){
        return getCorrectValue(_date.getDate()) + '.' + getCorrectMonth(_date.getMonth()) + '.' + _date.getFullYear() + ' ' + getCorrectValue(_date.getHours()) + ':' + getCorrectValue(_date.getMinutes()) + ':' + getCorrectValue(_date.getSeconds());
    }
    return 'Не корректная дата';

}