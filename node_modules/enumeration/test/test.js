var assert = require('assert')
, should = require('should')
, Enumeration = require('../index');

describe('Enumeration', function() {

	describe('Create enumeration using array of strings', function() {
		var simpleStringArrayOfColors1 = new Enumeration(['RED', 'GREEN', 'BLUE']);
		
		it('should retun 0 for RED', function() {
			simpleStringArrayOfColors1.RED.should.equal(0);
		})

		it('should retun "Green" as stringValue', function() {
			simpleStringArrayOfColors1.GREEN.toStringValue().should.equal('Green');
		})

		it('should return equal to GREEN when RED is incremented by 1', function() {
			simpleStringArrayOfColors1.GREEN.should.equal(simpleStringArrayOfColors1.RED + 1);
		})


		var simpleStringArrayOfColors2 = new Enumeration(['RED', 'GREEN', 'BLUE'], {startAt: 3});
		it('should retun 3 for RED', function() {
			simpleStringArrayOfColors2.RED.should.equal(3);
		})		

		it('should retun "Green"', function() {
			simpleStringArrayOfColors2.GREEN.toStringValue().should.equal('Green');
		})

		it('should equal ', function() {
			simpleStringArrayOfColors2.GREEN.should.equal(simpleStringArrayOfColors2.RED + 1);
		})


		var simpleStringArrayOfColors3 = new Enumeration(['RED', 'GREEN', 'BLUE']);
		it('should retun "Green"', function() {
			simpleStringArrayOfColors3.getStringValue(1).should.equal('Green');
		})

		var simpleStringArrayOfColors3 = new Enumeration(['RED', 'GREEN', 'BLUE']);
		it('should retun the optional parameter', function() {
			simpleStringArrayOfColors3.getStringValue(99, 'not found').should.equal('not found');
		})

		it('should retun true', function() {
			simpleStringArrayOfColors3.hasValue(2).should.equal(true);
		})
	})


	describe('Create enumeration using array of objects', function() {
		var objectArrayOfColors = new Enumeration([{RED: 0}, {GREEN: 1}, {BLUE: 2}]);

		it('should return 1 for GREEN', function() {
			objectArrayOfColors.GREEN.should.equal(1);
		})

		it('should return "Blue" as stringValue', function() {
			objectArrayOfColors.BLUE.toStringValue().should.equal('Blue');
		})

		it('should return equal to "BLUE" when "GREEN" is incremented by 1', function() {
			objectArrayOfColors.BLUE.should.equal(objectArrayOfColors.GREEN + 1)
		})


		var objectArrayOfColorsWithDefinedStringValue = new Enumeration([{RED: 0, stringValue: 'Red Roses'}, {GREEN: 1, stringValue: 'Green Light'}, {BLUE: 2, stringValue: 'Blue Book'}]);

		it('should return 1 for GREEN', function() {
			objectArrayOfColorsWithDefinedStringValue.GREEN.should.equal(1);
		})

		it('should return "Blue Book" as stringValue', function() {
			objectArrayOfColorsWithDefinedStringValue.BLUE.toStringValue().should.equal('Blue Book');
		})

		it('should not have a stringValue of "Blue"', function() {
			objectArrayOfColorsWithDefinedStringValue.BLUE.toStringValue().should.not.equal('Blue');
		})

		it('should return equal to "BLUE" when "GREEN" is incremented by 1', function() {
			objectArrayOfColorsWithDefinedStringValue.BLUE.should.equal(objectArrayOfColorsWithDefinedStringValue.GREEN + 1)
		})
	})


	describe('Create enumeration using plain objects', function() {
		var objectOfColors = new Enumeration({RED: 0, GREEN: 1, BLUE: 2});

		it('should return 2 for BLUE', function() {
			objectOfColors.BLUE.should.equal(2);
		})

		it('should return "Red" as stringValue', function() {
			objectOfColors.RED.toStringValue().should.equal('Red');
		})

		it('should equal to "RED" when "BLUE" is decremented by 2', function() {
			objectOfColors.RED.should.equal(objectOfColors.BLUE - 2);
		})
	})
})