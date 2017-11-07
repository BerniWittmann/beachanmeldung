import { parseDate, parseDateToISOString } from '@/utils/helpers';
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
  });
});
