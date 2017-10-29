import TeamMemberTransformer from '@/transformers/team-member';

describe('Transformers', () => {
  describe('TeamMember', () => {
    describe('should fetch a single team member', () => {
      it('should resolve the id correctly', () => {
        const original = { id: 1 };
        const transformed = {
          id: 1,
          name: undefined,
          role: undefined,
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the name correctly', () => {
        const original = { name: 'Test' };
        const transformed = {
          id: undefined,
          name: 'Test',
          role: undefined,
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the role correctly', () => {
        const original = { role: 'CEO' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: 'CEO',
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the email correctly', () => {
        const original = { email: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: 'test@byom.de',
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the description correctly', () => {
        const original = { description: 'desc' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: undefined,
          description: 'desc',
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the image correctly', () => {
        const original = { image: 'http://localhost:8000/img.jpg' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: undefined,
          description: undefined,
          image: 'http://localhost:8000/img.jpg',
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve the thumbnail correctly', () => {
        const original = { thumbnail: 'http://localhost:8000/img.jpg' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: 'http://localhost:8000/img.jpg',
        };
        expect(TeamMemberTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should resolve all given attributes correctly', () => {
        const original = {
          id: 1,
          name: 'team Member',
          role: 'CEO',
          email: 'test@byom.de',
          description: 'desc',
          image: 'http://localhost:8000/img.jpg',
          thumbnail: 'http://localhost:8000/img.jpg',
        };
        const transformed = {
          id: 1,
          name: 'team Member',
          role: 'CEO',
          email: 'test@byom.de',
          description: 'desc',
          image: 'http://localhost:8000/img.jpg',
          thumbnail: 'http://localhost:8000/img.jpg',
        };
        expect(TeamMemberTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = { another_attribute: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.fetch(original)).to.deep.equal(transformed);
      });
    });

    describe('should send a single team member', () => {
      it('should resolve the id correctly', () => {
        const original = { id: 1 };
        const transformed = {
          id: 1,
          name: undefined,
          role: undefined,
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the name correctly', () => {
        const original = { name: 'Test' };
        const transformed = {
          id: undefined,
          name: 'Test',
          role: undefined,
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the role correctly', () => {
        const original = { role: 'CEO' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: 'CEO',
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the email correctly', () => {
        const original = { email: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: 'test@byom.de',
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the description correctly', () => {
        const original = { description: 'desc' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: undefined,
          description: 'desc',
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the image correctly', () => {
        const original = { image: 'http://localhost:8000/img.jpg' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: undefined,
          description: undefined,
          image: 'http://localhost:8000/img.jpg',
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve the thumbnail correctly', () => {
        const original = { thumbnail: 'http://localhost:8000/img.jpg' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: 'http://localhost:8000/img.jpg',
        };
        expect(TeamMemberTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should resolve all given attributes correctly', () => {
        const original = {
          id: 1,
          name: 'team Member',
          role: 'CEO',
          email: 'test@byom.de',
          description: 'desc',
          image: 'http://localhost:8000/img.jpg',
          thumbnail: 'http://localhost:8000/img.jpg',
        };
        const transformed = {
          id: 1,
          name: 'team Member',
          role: 'CEO',
          email: 'test@byom.de',
          description: 'desc',
          image: 'http://localhost:8000/img.jpg',
          thumbnail: 'http://localhost:8000/img.jpg',
        };
        expect(TeamMemberTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = { another_attribute: 'test@byom.de' };
        const transformed = {
          id: undefined,
          name: undefined,
          role: undefined,
          email: undefined,
          description: undefined,
          image: undefined,
          thumbnail: undefined,
        };
        expect(TeamMemberTransformer.send(original)).to.deep.equal(transformed);
      });
    });

    describe('should fetch a collection of team members', () => {
      it('should resolve the id correctly', () => {
        const original = [{ id: 1 }, { id: 2 }];
        const transformed = [
          {
            id: 1,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: 2,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the name correctly', () => {
        const original = [{ name: 'test' }, { name: 'bar' }];
        const transformed = [
          {
            id: undefined,
            name: 'test',
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: 'bar',
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the role correctly', () => {
        const original = [{ role: 'CEO' }, { role: 'CTO' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: 'CEO',
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: 'CTO',
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the email correctly', () => {
        const original = [{ email: 'test@byom.de' }, { email: 'aha@byom.de' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: 'test@byom.de',
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: 'aha@byom.de',
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the description correctly', () => {
        const original = [{ description: 'test' }, { description: '42' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: 'test',
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: '42',
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the image correctly', () => {
        const original = [{ image: 'http://localhost:8000/img.jpg' }, { image: 'http://localhost:8000/img.png' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: 'http://localhost:8000/img.jpg',
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: 'http://localhost:8000/img.png',
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the thumbnail correctly', () => {
        const original = [{ thumbnail: 'http://localhost:8000/img.jpg' }, { thumbnail: 'http://localhost:8000/img.png' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: 'http://localhost:8000/img.jpg',
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: 'http://localhost:8000/img.png',
          },
        ];
        expect(TeamMemberTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve all given attributes correctly', () => {
        const original = [
          {
            id: 1,
            name: 'test',
            role: 'CEO',
            email: 'test@byom.de',
            description: 'test',
            image: 'http://localhost:8000/img.jpg',
            thumbnail: 'http://localhost:8000/img.png',
          },
          {
            id: 2,
            name: 'other',
            role: 'CTO',
            email: 'aha@byom.de',
            description: '1011',
            image: 'http://localhost:8000/other.jpg',
            thumbnail: 'http://localhost:8000/other.png',
          },
        ];
        const transformed = [
          {
            id: 1,
            name: 'test',
            role: 'CEO',
            email: 'test@byom.de',
            description: 'test',
            image: 'http://localhost:8000/img.jpg',
            thumbnail: 'http://localhost:8000/img.png',
          },
          {
            id: 2,
            name: 'other',
            role: 'CTO',
            email: 'aha@byom.de',
            description: '1011',
            image: 'http://localhost:8000/other.jpg',
            thumbnail: 'http://localhost:8000/other.png',
          },
        ];
        expect(TeamMemberTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = [{ another_attribute: 'test' }, { foo: 'bar' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
    });

    describe('should send a collection of team members', () => {
      it('should resolve the id correctly', () => {
        const original = [{ id: 1 }, { id: 2 }];
        const transformed = [
          {
            id: 1,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: 2,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the name correctly', () => {
        const original = [{ name: 'test' }, { name: 'bar' }];
        const transformed = [
          {
            id: undefined,
            name: 'test',
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: 'bar',
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the role correctly', () => {
        const original = [{ role: 'CEO' }, { role: 'CTO' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: 'CEO',
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: 'CTO',
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the email correctly', () => {
        const original = [{ email: 'test@byom.de' }, { email: 'aha@byom.de' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: 'test@byom.de',
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: 'aha@byom.de',
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the description correctly', () => {
        const original = [{ description: 'test' }, { description: '42' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: 'test',
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: '42',
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the image correctly', () => {
        const original = [{ image: 'http://localhost:8000/img.jpg' }, { image: 'http://localhost:8000/img.png' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: 'http://localhost:8000/img.jpg',
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: 'http://localhost:8000/img.png',
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve the thumbnail correctly', () => {
        const original = [{ thumbnail: 'http://localhost:8000/img.jpg' }, { thumbnail: 'http://localhost:8000/img.png' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: 'http://localhost:8000/img.jpg',
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: 'http://localhost:8000/img.png',
          },
        ];
        expect(TeamMemberTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
      it('should resolve all given attributes correctly', () => {
        const original = [
          {
            id: 1,
            name: 'test',
            role: 'CEO',
            email: 'test@byom.de',
            description: 'test',
            image: 'http://localhost:8000/img.jpg',
            thumbnail: 'http://localhost:8000/img.png',
          },
          {
            id: 2,
            name: 'other',
            role: 'CTO',
            email: 'aha@byom.de',
            description: '1011',
            image: 'http://localhost:8000/other.jpg',
            thumbnail: 'http://localhost:8000/other.png',
          },
        ];
        const transformed = [
          {
            id: 1,
            name: 'test',
            role: 'CEO',
            email: 'test@byom.de',
            description: 'test',
            image: 'http://localhost:8000/img.jpg',
            thumbnail: 'http://localhost:8000/img.png',
          },
          {
            id: 2,
            name: 'other',
            role: 'CTO',
            email: 'aha@byom.de',
            description: '1011',
            image: 'http://localhost:8000/other.jpg',
            thumbnail: 'http://localhost:8000/other.png',
          },
        ];
        expect(TeamMemberTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = [{ another_attribute: 'test' }, { foo: 'bar' }];
        const transformed = [
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
          {
            id: undefined,
            name: undefined,
            role: undefined,
            email: undefined,
            description: undefined,
            image: undefined,
            thumbnail: undefined,
          },
        ];
        expect(TeamMemberTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
    });
  });
});
