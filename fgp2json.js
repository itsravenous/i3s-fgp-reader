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

	var buffer = fs.readFileSync(file)
	var reader = new BufferReader(buffer);

	// Get FGP I3S version - TODO check this is an I3S Classic fingerprint
	var version = reader.nextString(4);

	// Get reference points
	var refs = [];
	refs.push([reader.nextDoubleBE(), reader.nextDoubleBE()]);
	refs.push([reader.nextDoubleBE(), reader.nextDoubleBE()]);
	refs.push([reader.nextDoubleBE(), reader.nextDoubleBE()]);

	// Get number of keypoints
	var cnt = reader.nextInt32BE();

	// Get keypoints
	var keypoints = [];
	for (var i = 0; i < cnt; i ++) {
		keypoints.push([reader.nextDoubleBE(), reader.nextDoubleBE(), reader.nextDoubleBE()]);
	}

	// Create fingerprint object
	var fgp = {
		refs: refs,
		keypoints: keypoints
	}

	return fgp;
}

// Export function
module.exports = readFingerprint;