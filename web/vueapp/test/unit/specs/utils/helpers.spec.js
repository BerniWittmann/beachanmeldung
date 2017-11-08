import { parseDate, parseDateToISOString, getDateTimeByKey } from '@/utils/helpers';
import moment from 'moment';

describe('Utils', () => {
  describe('Helpers', () => {
    describe('parseDate', () => {
      it('should parse an ISO String to a moment object', () => {
        const date = moment();
        expect(parseDate(date.toISOString()).isSame(date)).to.equal(true);
      });
      it('should parse a normal Date String to a moment object', () => {
        const date = moment();
        expect(parseDate(date.format('DD.MM.YYYY')).isSame(date, 'day')).to.equal(true);
      });
      it('should parse an undefined date to undefined', () => {
        expect(parseDate(undefined)).to.equal(undefined);
        expect(parseDate(null)).to.equal(undefined);
      });
    });

    describe('parseDateToISOString', () => {
      it('should parse a normal moment to a ISO String', () => {
        const date = moment();
        expect(parseDateToISOString(date)).to.equal(date.toISOString());
      });
      it('should parse an undefined date to undefined', () => {
        expect(parseDateToISOString(undefined)).to.equal(undefined);
        expect(parseDateToISOString(null)).to.equal(undefined);
      });
    });

    describe('getDateTimeByKey', () => {
      it('should get date and time from an object by key', () => {
        const obj = {
          testKey: moment()
        };
        expect(getDateTimeByKey(obj, 'testKey')).to.deep.equal({
          date: obj.testKey.format('DD.MM.YYYY'),
          time: obj.testKey.format('HH:mm'),
        });
      });

      it('should empty object when having invalid parameters', () => {
        const obj = {
          testKey: moment(),
          foo: 'bar',
        };
        expect(getDateTimeByKey(undefined, 'testKey')).to.deep.equal({
          date: undefined,
          time: undefined,
        });
        expect(getDateTimeByKey(obj, 'anotherKey')).to.deep.equal({
          date: undefined,
          time: undefined,
        });
        expect(getDateTimeByKey(obj, 'foo')).to.deep.equal({
          date: undefined,
          time: undefined,
        });
      });
    });
  });
});
