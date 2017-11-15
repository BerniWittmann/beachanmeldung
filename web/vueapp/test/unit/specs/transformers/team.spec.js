import TeamTransformer from '@/transformers/team';
import moment from 'moment';

describe('Transformers', () => {
  describe('Team', () => {
    describe('should fetch a team', () => {
      it('should resolve the signupDate correctly', () => {
        const date = moment();
        const original = { date_signup: date.toISOString() };
        const transformed = TeamTransformer.fetch(original);
        expect(transformed.dateSignup).to.exist;
        expect(transformed.dateSignup.isValid()).to.be.true;
        expect(date.isSame(transformed.dateSignup, 'minute')).to.be.true;
      });
      it('should resolve all given attributes correctly', () => {
        const original = {
          id: 1,
          name: 'Test',
          beachname: 'Beach',
          date_signup: undefined,
          state: 'waiting',
          paid: true,
          trainer: undefined,
          tournament: undefined,
          is_displayed: true,
          complete_name: 'Beach (Test)',
        };
        const transformed = {
          id: 1,
          name: 'Test',
          beachname: 'Beach',
          dateSignup: undefined,
          state: 'waiting',
          paid: true,
          trainer: undefined,
          tournament: undefined,
          isDisplayed: true,
          completeName: 'Beach (Test)',
        };
        expect(TeamTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = { another_attribute: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          beachname: undefined,
          dateSignup: undefined,
          state: undefined,
          paid: undefined,
          trainer: undefined,
          tournament: undefined,
          isDisplayed: undefined,
          completeName: undefined,
        };
        expect(TeamTransformer.fetch(original)).to.deep.equal(transformed);
      });
    });

    describe('should send a single team', () => {
      it('should resolve all given attributes correctly', () => {
        const date = moment();
        const original = {
          id: 1,
          name: 'Test',
          beachname: 'Beach',
          dateSignup: date,
          state: 'waiting',
          paid: true,
          trainer: {},
          tournament: {},
          tournamentID: 5,
          isDisplayed: true,
          completeName: 'Beach (Test)',
        };
        const transformed = {
          id: 1,
          name: 'Test',
          beachname: 'Beach',
          tournament: 5,
        };
        expect(TeamTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = { another_attribute: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          beachname: undefined,
          tournament: undefined,
        };
        expect(TeamTransformer.send(original)).to.deep.equal(transformed);
      });
    });
  });
});
