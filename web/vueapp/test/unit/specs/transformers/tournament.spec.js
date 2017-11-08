import TournamentTransformer from '@/transformers/tournament';
import moment from 'moment';

describe('Transformers', () => {
  describe('Tournament', () => {
    describe('should fetch a tournament', () => {
      it('should resolve the id correctly', () => {
        const original = { id: 1 };
        const transformed = {
          id: 1,
          name: undefined,
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: undefined,
          signupOpen: undefined,
          startingFee: undefined,
          isBeforeSignup: undefined,
          isAfterSignup: undefined,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the name correctly', () => {
        const original = { name: 'Test' };
        const transformed = {
          id: undefined,
          name: 'Test',
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: undefined,
          signupOpen: undefined,
          startingFee: undefined,
          isBeforeSignup: undefined,
          isAfterSignup: undefined,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the gender correctly', () => {
        const original = { gender: 'male' };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: 'male',
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: undefined,
          signupOpen: undefined,
          startingFee: undefined,
          isBeforeSignup: undefined,
          isAfterSignup: undefined,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the startDate correctly', () => {
        const date = moment();
        const original = { start_date: date.format('DD.MM.YYYY') };
        const transformed = TournamentTransformer.fetch(original);
        expect(transformed.startDate).to.exist;
        expect(transformed.startDate.isValid()).to.be.true;
        expect(date.isSame(transformed.startDate, 'day')).to.be.true;
      });
      it('should resolve the endDate correctly', () => {
        const date = moment();
        const original = { end_date: date.format('DD.MM.YYYY') };
        const transformed = TournamentTransformer.fetch(original);
        expect(transformed.endDate).to.exist;
        expect(transformed.endDate.isValid()).to.be.true;
        expect(date.isSame(transformed.endDate, 'day')).to.be.true;
      });
      it('should resolve the start Signup correctly', () => {
        const date = moment();
        const original = { start_signup: date.format('DD.MM.YYYY') };
        const transformed = TournamentTransformer.fetch(original);
        expect(transformed.startSignup).to.exist;
        expect(transformed.startSignup.isValid()).to.be.true;
        expect(date.isSame(transformed.startSignup, 'day')).to.be.true;
      });
      it('should resolve the deadline Signup correctly', () => {
        const date = moment();
        const original = { deadline_signup: date.format('DD.MM.YYYY') };
        const transformed = TournamentTransformer.fetch(original);
        expect(transformed.deadlineSignup).to.exist;
        expect(transformed.deadlineSignup.isValid()).to.be.true;
        expect(date.isSame(transformed.deadlineSignup, 'day')).to.be.true;
      });
      it('should resolve the deadline Edit correctly', () => {
        const date = moment();
        const original = { deadline_edit: date.format('DD.MM.YYYY') };
        const transformed = TournamentTransformer.fetch(original);
        expect(transformed.deadlineEdit).to.exist;
        expect(transformed.deadlineEdit.isValid()).to.be.true;
        expect(date.isSame(transformed.deadlineEdit, 'day')).to.be.true;
      });
      it('should resolve the tournamentDate correctly', () => {
        const date = moment();
        let original = { start_date: date.format('DD.MM.YYYY'), end_date: date.format('DD.MM.YYYY') };
        let transformed = TournamentTransformer.fetch(original);
        console.log(transformed);
        expect(transformed.tournamentDate).to.equal(date.format('DD.MM.YYYY'));

        const startDate = moment();
        const endDate = moment().add(1, 'day');
        original = { start_date: startDate.format('DD.MM.YYYY'), end_date: endDate.format('DD.MM.YYYY') };
        transformed = TournamentTransformer.fetch(original);
        console.log(transformed);

        expect(transformed.tournamentDate).to.equal(startDate.format('DD.MM.YYYY') + ' - ' + endDate.format('DD.MM.YYYY'));
      });
      it('should resolve the advertisement Url correctly', () => {
        const original = { advertisement_url: 'http://www.google.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: 'http://www.google.de',
          contactEmail: undefined,
          signupOpen: undefined,
          startingFee: undefined,
          isBeforeSignup: undefined,
          isAfterSignup: undefined,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the contact Email correctly', () => {
        const original = { contact_email: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: 'test@byom.de',
          signupOpen: undefined,
          startingFee: undefined,
          isBeforeSignup: undefined,
          isAfterSignup: undefined,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the signup Open state correctly', () => {
        const original = { signup_open: true };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: undefined,
          signupOpen: true,
          startingFee: undefined,
          isBeforeSignup: undefined,
          isAfterSignup: undefined,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the starting Fee correctly', () => {
        const original = { starting_fee: 60.00 };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: undefined,
          signupOpen: undefined,
          startingFee: 60.00,
          isBeforeSignup: undefined,
          isAfterSignup: undefined,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the is After Signup correctly', () => {
        const original = { is_after_signup: true };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: undefined,
          signupOpen: undefined,
          startingFee: undefined,
          isBeforeSignup: undefined,
          isAfterSignup: true,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the is Before Signup correctly', () => {
        const original = { is_before_signup: true };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: undefined,
          signupOpen: undefined,
          startingFee: undefined,
          isBeforeSignup: true,
          isAfterSignup: undefined,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the number of places correctly', () => {
        const original = { number_of_places: 12 };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: undefined,
          signupOpen: undefined,
          startingFee: undefined,
          isBeforeSignup: undefined,
          isAfterSignup: undefined,
          numberOfPlaces: 12,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve all given attributes correctly', () => {
        const original = {
          id: 1,
          name: 'Test',
          gender: 'male',
          start_date: undefined,
          end_Date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: 'http://www.google.de',
          contact_email: 'test@byom.de',
          signup_open: true,
          starting_fee: 60.00,
          is_before_signup: false,
          is_after_signup: false,
          number_of_places: 12,
          tournamentDate: undefined,
        };
        const transformed = {
          id: 1,
          name: 'Test',
          gender: 'male',
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: 'http://www.google.de',
          contactEmail: 'test@byom.de',
          signupOpen: true,
          startingFee: 60.00,
          isBeforeSignup: false,
          isAfterSignup: false,
          numberOfPlaces: 12,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = { another_attribute: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          startDate: undefined,
          endDate: undefined,
          startSignup: undefined,
          deadlineSignup: undefined,
          deadlineEdit: undefined,
          advertisementUrl: undefined,
          contactEmail: undefined,
          signupOpen: undefined,
          startingFee: undefined,
          isBeforeSignup: undefined,
          isAfterSignup: undefined,
          numberOfPlaces: undefined,
          tournamentDate: undefined,
        };
        expect(TournamentTransformer.fetch(original)).to.deep.equal(transformed);
      });
    });

    describe('should send a single tournament', () => {
      it('should resolve the id correctly', () => {
        const original = { id: 1 };
        const transformed = {
          id: 1,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the name correctly', () => {
        const original = { name: 'Test' };
        const transformed = {
          id: undefined,
          name: 'Test',
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the gender correctly', () => {
        const original = { gender: 'male' };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: 'male',
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the startDate correctly', () => {
        const date = moment();
        const original = { startDate: date };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: date.toISOString(),
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the endDate correctly', () => {
        const date = moment();
        const original = { endDate: date };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: date.toISOString(),
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the start Signup correctly', () => {
        const date = moment();
        const original = { startSignup: date };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: date.toISOString(),
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the deadline Signup correctly', () => {
        const date = moment();
        const original = { deadlineSignup: date };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: date.toISOString(),
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the deadline Edit correctly', () => {
        const date = moment();
        const original = { deadlineEdit: date };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: date.toISOString(),
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the advertisement Url correctly', () => {
        const original = { advertisementUrl: 'http://www.google.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: 'http://www.google.de',
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the contact Email correctly', () => {
        const original = { contactEmail: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: 'test@byom.de',
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the signup Open state correctly', () => {
        const original = { signupOpen: true };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: true,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the starting Fee correctly', () => {
        const original = { startingFee: 60.00 };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: 60.00,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the number Of Places correctly', () => {
        const original = { numberOfPlaces: 12 };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: 12,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve all given attributes correctly', () => {
        const date = moment();
        const original = {
          id: 1,
          name: 'Test',
          gender: 'male',
          startDate: date,
          endDate: date,
          startSignup: date,
          deadlineSignup: date,
          deadlineEdit: date,
          advertisementUrl: 'http://www.google.de',
          contactEmail: 'test@byom.de',
          signupOpen: true,
          startingFee: 60.00,
          numberOfPlaces: undefined,
        };
        const transformed = {
          id: 1,
          name: 'Test',
          gender: 'male',
          start_date: date.toISOString(),
          end_date: date.toISOString(),
          start_signup: date.toISOString(),
          deadline_signup: date.toISOString(),
          deadline_edit: date.toISOString(),
          advertisement_url: 'http://www.google.de',
          contact_email: 'test@byom.de',
          signup_open: true,
          starting_fee: 60.00,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = { another_attribute: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          gender: undefined,
          start_date: undefined,
          end_date: undefined,
          start_signup: undefined,
          deadline_signup: undefined,
          deadline_edit: undefined,
          advertisement_url: undefined,
          contact_email: undefined,
          signup_open: undefined,
          starting_fee: undefined,
          number_of_places: undefined,
        };
        expect(TournamentTransformer.send(original)).to.deep.equal(transformed);
      });
    });
  });
});
