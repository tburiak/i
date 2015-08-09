/**
 * Поле 'markers' має посиланнями на поля, що потребують валідації по певному формату.
 * Важливо: різні маркери можуть призначатися одним і тим же полям. 
 * Див. i/issues/375, 654
 *
 * Валідатори:
 *
 * 1) 'TextUA' - Усі українскі літери, без цифр, можливий мінус (дефіс) та пробіл
 * Текст помилки: 'Текст може містити тількі українські літери або мінус чи пробіл'
 *
 * 2) 'TextRU' - Усі російські літери, без цифр, можливий мінус (дефіс) та пробіл
 * Текст помилки: 'Текст може містити тількі російські літери або мінус чи пробіл'
 *
 * 3) 'DateFormat' - Дата у заданому форматі DATE_FORMAT
 * Текст помилки: 'Дата може бути тільки формату DATE_FORMAT'
 *
 * 4) 'DateElapsed' - З/до дати у полі з/після поточної, більше/менше днів/місяців/років
 * Текст помилки: 'З/до дати з/після сьогоднішньої, має бути більше/менше ніж х-днів, х-місяців, х-років.
 *
 * х-___        - підставляти тільки, якщо x не дорівнює 0
 * З/До         - в залежності від bFuture
 * більше/менше - в залежності від bLess
 *
 * Приклад об'єкту markers:
 *
 * var markers = {
 *  'validate': {
 *    'PhoneUA': {
 *      'aField_ID': ['privatePhone','workPhone']
 *    }, 'Mail': {
 *      'aField_ID': ['privateMail', 'someMail']
 *    }, 'TextUA': { 
 *      'aField_ID': ['fio']
 *    }, 'TextRU': {
 *      'aField_ID': ['fio_RU']
 *    }, 'DateFormat': {
 *      'aField_ID': ['fio'],
 *      'sFormat': 'YYYY-MM-DD' //
 *    }, 'DateElapsed': {
 *      'aField_ID': ['dateOrder'],
 *      'bFuture': false, //если true то дата должна быть в будущем
 *      'bLess': true, //если true то 'дельта' между датами должна быть 'менее чем' (указана нижними параметрами)
 *      'nDays': 3,
 *      'nMounths': 0,
 *      'nYears': 1
 *    }
 *  }
 * };
 *
 * Де 'privatePhone' і 'workPhone' - це назви полів, яку треба валідувати.
 *
 */
angular.module('app').service('ValidationService', function () {
  'use strict';

  this.validateByMarkers = function( form, $scope ) {

    var validatorByName = { 
      'Mail': 'email',
      'AutoVIN': 'autovin',
      'PhoneUA': 'tel',
      'TextUA': 'textua',
      'TextRU': 'textru',
      'DateFormat': 'dateformat',
      'DateElapsed': 'dateelapsed'
    };

    var markers = $scope.markers;

    if ( !markers || !markers.validate || markers.validate.length < 1 ) {
      return;
    }

    // markers are here, so we can check if field is marked by it's name: 
    
    var oValidators = {};

    angular.forEach( markers.validate, function ( validator, validatorName ) {

      console.log( 'validator: ', validatorName, ' = ', validator );

      function getValidatorByName( validatorName, field ) {

        var validatorFunctionByName = {
          
          'Mail': function( modelValue ) {
            console.log('Validate email: ', modelValue );
            var EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            return field.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
          },
          
          'AutoVIN': function( sValue ) {
            // Логика: набор из 17 символов.
            // Разрешено использовать все арабские цифры и латинские буквы (А В C D F Е G Н J К L N М Р R S Т V W U X Y Z),
            // За исключением букв Q, O, I. (Эти буквы запрещены для использования, поскольку O и Q похожи между собой, а I и O можно спутать с 0 и 1.)
            var bValid = true;

            bValid = bValid && (sValue !== null);
            bValid = bValid && (sValue.length === 17);
            bValid = bValid && (/^[a-zA-Z0-9]+$/.test(sValue));
            bValid = bValid && (sValue.indexOf('q') < 0 && sValue.indexOf('o') < 0 && sValue.indexOf('i') < 0);
            bValid = bValid && (sValue.indexOf('Q') < 0 && sValue.indexOf('O') < 0 && sValue.indexOf('I') < 0);

            return field.$isEmpty( sValue ) || bValid;
          },

          'PhoneUA': null,

          /* 'TextUA' - Усі українскі літери, без цифр, можливий мінус (дефіс) та пробіл
           * Текст помилки: 'Текст може містити тількі українські літери або мінус чи пробіл'
           */
          'TextUA': function( modelValue ) {
            console.log('Validate TextUA: ', modelValue );
            var TEXTUA_REGEXP = /([Є-ЯҐ]|[а-їґ]|-)+\s?/g;
            return TEXTUA_REGEXP.test( modelValue );
          },

          /* 'TextRU' - Усі російські літери, без цифр, можливий мінус (дефіс) та пробіл
           * Текст помилки: 'Текст може містити тількі російські літери або мінус че пробіл'
           */
          'TextRU': function( modelValue ) {
            console.log('Validate TextRU: ', modelValue );
            return /([А-яЁё]|-)+\s?/g.test( modelValue );
          },

          /* 'DateFormat' - Дата у заданому форматі DATE_FORMAT
           * Текст помилки: 'Дата може бути тільки формату DATE_FORMAT'
           */
          'DateFormat': function( modelValue ) {
            console.log('Validate DateFormat: ', modelValue );
            
            // sFormat': 'YYYY-MM-DD' //
          
            return true;
          },

          /* 'DateElapsed' - З/до дати у полі з/після поточної, більше/менше днів/місяців/років
           * Текст помилки: 'З/до дати з/після сьогоднішньої, має бути більше/менше ніж х-днів, х-місяців, х-років.
           * х-___        - підставляти тільки, якщо x не дорівнює 0
           * З/До         - в залежності від bFuture
           * більше/менше - в залежності від bLess
           */
          'DateElapsed': function( modelValue ) {
            console.log('Validate DateElapsed: ', modelValue );
            return true;
          }
        };

        // console.log('validatorFunctionByName = ', validatorName, validatorFunctionByName[validatorName]);

        return validatorFunctionByName[validatorName] ? validatorFunctionByName[validatorName] : null;
      }
      
      angular.forEach( form, function ( field ) {
        if ( field && field.$name && _.indexOf( markers.validate[validatorName]['aField_ID'], field.$name ) !== -1 ) {
          
          console.log( '\tfield:', field.$name );
          
          // overwrite the default Angular field validator
          if( !field.$validators[validatorByName[validatorName]] ) {

            field.$validators[validatorByName[validatorName]] = getValidatorByName(validatorName, field);
          
            // and validate it
            field.$validate();
          }

        }
      });

      oValidators[validatorName] = validator;

    });

    // console.log(oValidators);

 // validate('DateElapsed');

  };

  /**
   * What is it? Check here: http://planetcalc.ru/2464/
   */
  this.getLunaValue = function ( id ) {
    //TODO: Fix Alhoritm Luna
    //Number 2187501 must give CRC=3
    //Check: http://planetcalc.ru/2464/
    //var inputNumber = 3;

    var n = parseInt(id);
    //var n = parseInt(2187501);

    var nFactor = 1;
    var nCRC = 0;
    var nAddend;
    while (n !== 0){
        nAddend = Math.round(nFactor * (n % 10));
        nFactor = (nFactor === 2) ? 1 : 2;
        nAddend = nAddend > 9 ? nAddend - 9 : nAddend;
        nCRC += nAddend;
        n = parseInt(n / 10);
    }

    nCRC = nCRC%10;

    // alert(nCRC%10);
    // nCRC=Math.round(nCRC/10)
    // alert(nCRC%10);
    // alert(nCRC);

    return nCRC;
  };

});