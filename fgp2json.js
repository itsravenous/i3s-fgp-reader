/**
 * @file FGP2JSON
 * @author Tom Jenkins tom@itsravenous.com
 */

var fs = require('fs');
var BufferReader = require('buffer-reader');

/**
 * Creates a JSON representation of an I3S .fgp (fingerprint) file
 * @param {String} fingerprint file to read
 * @return {Object} fingerprint, mae up of reference points and keypoints
 */
var readFingerprint = function (file) {
	var filesize = fs.statSync(file).size;

	var buffer = fs.readFileSync(file);
	var reader = new BufferReader(buffer);

	// Get FGP I3S version - TODO check this is an I3S Classic fingerprint
	var version = reader.nextString(4);

	// Get reference points
	var ref1x = reader.nextDoubleBE();
	var ref1y = reader.nextDoubleBE();
	var ref2x = reader.nextDoubleBE();
	var ref2y = reader.nextDoubleBE();
	var ref3x = reader.nextDoubleBE();
	var ref3y = reader.nextDoubleBE();
	/**
	 * List of reference points grouped in arrays of x and y
	 */
	var refs = [
		[ref1x, ref1y],
		[ref2x, ref2y],
		[ref3x, ref3y]
	];
	/**
	 * List of reference points as flat array
	 */
	var refsRaw = [ref1x, ref1y, ref2x, ref2y, ref3x, ref3y];

	// Get number of keypoints
	var cnt = reader.nextInt32BE();

	// Get keypoints
	/**
	 * List of keypoints grouped in arrays of x, y and size
	 */
	var keypoints = [];
	/**
	 * List of keypoints in a flat array, without size
	 */
	var keypointsRaw = [];
	var x, y, size;
	for (var i = 0; i < cnt; i ++) {
		x = reader.nextDoubleBE();
		y = reader.nextDoubleBE();
		size = reader.nextDoubleBE();
		keypoints.push([x, y, size]);
		keypointsRaw.push(x, y);
	}

	// Create fingerprint object
	var fgp = {
		refs: refs,
		refsRaw: refsRaw,
		keypoints: keypoints,
		keypointsRaw: keypointsRaw
	};

	return fgp;
};

// Export function
module.exports = readFingerprint;