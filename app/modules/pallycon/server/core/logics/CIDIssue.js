(function() {
    "use strict";

    var makeDrm = require('./makeDrmData');
    var xml2js = require("xml2js");
    var xmlparser = new xml2js.Parser();

    module.exports = {
        "makeRes": function makeRes(data) {

            /* ============================================================================== */
            /* =   PAGE : Content ID 발급 page / Content ID issuance page                     = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Packager에서 Packaging을 진행할 때, 필요한 Content ID를 PallyCon Cloud 서      = */
            /* =   버를 통해 발급해주는 페이지 입니다.                                           = */
            /* =                                                                            = */
            /* =   ※ 중요                                                                   = */
            /* =   1. 상용 서비스에 적용 시, 해당 서비스의 Content ID 생성 규칙을 반영해 주시기 바랍니다.   = */
            /* = -------------------------------------------------------------------------- = */
            /* =   This page issues content ID used for content packaging via PallyCon    = */
            /* =   cloud server.                                                  = */
            /* =                                                                            = */
            /* =   ※ Notice                                                                 = */
            /* =   1. The Content ID should be generated by your own rule when this page    = */
            /* =      is used for production.                                               = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Copyright (c)  2015   INKA Entworks Inc.   All Rights Reserverd.         = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   1. 데이터 설정 / Data setting                                               = */
            /* = -------------------------------------------------------------------------- = */
            /* = -------------------------------------------------------------------------- = */
            /* =   1-1. ERROR_CODE/MESSAGE 설정                        = */
            /* =   - ERROR_CODE: 4자리의 숫자로만 구성됩니다. INKA에서 이미 설정된 값을 사용         = */
            /* =                 합니다. 업체에서 사용되는 에러코드는 정책 반영하는 부분에           = */
            /* =                 설명되어 있으니 참고 부탁드립니다.                    = */
            /* =    ** 0000 은 성공입니다. 다른 값은 에러로 인식됩니다.                 = */
            /* = -------------------------------------------------------------------------- = */
            /* =   1-2. ERROR_CODE/MESSAGE setting                                         = */
            /* =   - ERROR_CODE: 4 digit value. Pre-defined by INKA.            = */
            /* =                 The error codes for your service can be set when setting   = */
            /* =                 your business rules.                   = */
            /* =    ** 0000 means success. Other codes mean failure.            = */
            /* = -------------------------------------------------------------------------- = */
            var ERROR_CODE = "0000";
            var MESSAGE = "";
            /* = -------------------------------------------------------------------------- = */
            /* =   1-2. CID, sNonce 설정                           = */
            /* =   - CID: Content ID입니다. 업체에서 생성해야 할 값입니다. BM 적용 전에는          = */
            /* =          CONFIG.php의 값을 사용합니다.                     = */
            /* =   - sNonce: PallyCon Cloud Server에서 요청할 때 전달하는 값으로 페이지에서       = */
            /* =             응답데이터를 PallyCon Cloud Server로 전달하면, 그 값이 유효한지        = */
            /* =             판단합니다.                           = */
            /* = -------------------------------------------------------------------------- = */
            /* =   1-2. CID, sNonce settings                                               = */
            /* =   - CID: Content ID generated by service provider. The default ID for test is  = */
            /* =          set by CONFIG.php file.                     = */
            /* =   - sNonce: A value which will be used for authentication of response.   = */
            /* =             It will be passed in a request from PallyCon Cloud server    = */
            /* =             and checked by PallyCon Cloud server in a response data.   = */
            /* = -------------------------------------------------------------------------- = */
            var CID = "";
            var sNonce = "";
            /* = -------------------------------------------------------------------------- = */
            /* =   1-3. sResponse: PallyCon Cloud Server로 전달하는 응답값입니다.         = */
            /* = -------------------------------------------------------------------------- = */
            /* =   1-3. sResponse: response data to PallyCon Cloud Server          = */
            /* = -------------------------------------------------------------------------- = */
            var sResponse = "";
            /* = -------------------------------------------------------------------------- = */
            /* =   1. 데이터 설정 END / End of data setting                                    = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   2. REQUEST DATA 파싱 / Parsing request data               = */
            /* = -------------------------------------------------------------------------- = */
            /* =   2-1. REQUEST DATA에서 data의 값을 추출합니다.                 = */
            /* = -------------------------------------------------------------------------- = */
            /* =   2-1. Get data from REQUEST                        = */
            /* = -------------------------------------------------------------------------- = */
            var sData = "";
            if (data) {
                sData = data;
                console.log('[Encrypted String]:' + sData);
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   2-2. 추출에 실패할 경우 에러코드와 메시지를 설정합니다.                 = */
            /* = -------------------------------------------------------------------------- = */
            /* =   2-2. Set error code and message if failed to parse data                 = */
            /* = -------------------------------------------------------------------------- = */
            else {
                ERROR_CODE = "1201";
                MESSAGE = "NO DATA";
                console.log("[ERROR]: " + ERROR_CODE + "\n[MESSAGE]: " + MESSAGE);
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   2. REQUEST DATA 파싱 END / End of parsing request data          = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   3. REQUEST DATA 복호화 / Decrypt request data                = */
            /* = -------------------------------------------------------------------------- = */
            /* = -------------------------------------------------------------------------- = */
            /* =   3-1. ERROR_CODE 값이 성공이면 복호화를 시작합니다.                 = */
            /* =   복호화에 실패할 경우 에러코드와 메시지를 설정합니다.                    = */
            /* = -------------------------------------------------------------------------- = */
            /* =   3-1. Starting decryption if ERROR_CODE is '0000'.           = */
            /* =   Set error code and message if failed to decrypt.                         = */
            /* = -------------------------------------------------------------------------- = */
            var sDecrypted = "";
            if (ERROR_CODE == "0000") {
                sDecrypted = makeDrm.decrypt(sData);
                if (sDecrypted) {
                    console.log("[Decrypted String]: " + sDecrypted);
                } else {
                    ERROR_CODE = "1202";
                    MESSAGE = "Fail to Decrypt the data";
                    winston.error("[ERROR]: " + ERROR_CODE + "[MESSAGE]: " + MESSAGE);
                }
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   3. REQUEST DATA 복호화 END / End of decrypting request data        = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   4. XML 파싱 / XML Parsing                         = */
            /* = -------------------------------------------------------------------------- = */
            /* = -------------------------------------------------------------------------- = */
            /* =   4-1. ERROR_CODE 값이 성공이면 XML을 파싱합니다.                 = */
            /* =   XML 파싱에 실패할 경우 에러코드와 메시지를 설정합니다.                   = */
            /* = -------------------------------------------------------------------------- = */
            /* =   4-1. Starts XML parsing if ERROR_CODE is '0000'.            = */
            /* =   Set error code and message if failed to parse XML.                       = */
            /* = -------------------------------------------------------------------------- = */
            var sJsonResult;
            if (ERROR_CODE == "0000") {
                if(makeDrm.getAPIType() == "XML") {
                    xmlparser.parseString(sDecrypted, function(err, result) {
                        if (err) {
                            ERROR_CODE = "1203";
                            MESSAGE = "Fail to Parse XML";
                            winston.error("[ERROR]: " + ERROR_CODE + "[MESSAGE]: " + MESSAGE);
                        } else {
                            console.log('[XML-JSON Result] ' + JSON.stringify(result));
                            sJsonResult = result;
                            sNonce = sJsonResult.RES.NONCE;
                        }
                    });
                } else {    // JSON type
                    sJsonResult = JSON.parse(sDecrypted);
                    sNonce = sJsonResult.nonce;
                }
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   4. XML 파싱 END / End of XML parsing                    = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   5. Content ID 생성 / Content ID generation                              = */
            /* =                                                                            = */
            /* =   ※ 중요 :  업체의 정책을 반영하는 곳입니다.                                       = */
            /* =   ※ Note : Need to apply your CID generation rule here                     = */
            /* =                                                                            = */
            /* = -------------------------------------------------------------------------- = */
            /* = -------------------------------------------------------------------------- = */
            /* =   5-1. ERROR_CODE 값이 성공이면 Content ID 생성을 시작합니다.             = */
            /* = -------------------------------------------------------------------------- = */
            /* =   5-1. Starts generating Content ID if ERROR_CODE is '0000'.        = */
            /* = -------------------------------------------------------------------------- = */
            if (ERROR_CODE == "0000") {
                /*-
                 *
                 * [업체 청책 반영]
                 *
                 * 업체의 정책에 맞게 Content ID를 생성하는 로직을 이곳에 구현합니다.
                 * Content ID를 생성하는데 활용할 값은 다음과 같습니다.
                 *
                 * - $sFilePath
                 * - $sFileName
                 *
                 * ERROR_CODE는 성공일 경우 "0000"을 유지 시켜줍니다.
                 *
                 *
                 * [Applying CID rule]
                 *
                 * Your CID generation logic can be applied here.
                 * The below parameters can be used for the logic.
                 *
                 * - $sFilePath
                 * - $sFileName
                 *
                 * ** The default $ContentID value for test is defined in CONFIG.php.
                 *
                 * ERROR_CODE "0000" means success.
                 *
                 */
                ERROR_CODE = "0000";

                var sFilePath, sFileName;

                if(makeDrm.getAPIType() == "XML") {
                    sFilePath = sJsonResult.RES.FILEPATH.toString(); // 업체에서 Content ID를 생성하는데 활용할 수 있는 원본파일 경로 입니다.
                    sFileName = sJsonResult.RES.FILENAME.toString(); // 업체에서 Content ID를 생성하는데 활용할 수 있는 원본파일명
                } else {    // JSON type
                    sFilePath = sJsonResult.file_path; // 업체에서 Content ID를 생성하는데 활용할 수 있는 원본파일 경로 입니다.
                    sFileName = sJsonResult.file_name; // 업체에서 Content ID를 생성하는데 활용할 수 있는 원본파일명
                }

                /*
                 * 퀵스타트 샘플은 파일명의 확장자를 제거한 파일명을 cid로 세팅하게 되어있습니다.
                 * 확장자를 제거한 파일명이 200자리를 넘어갈 경우 뒷부분을 잘라냅니다.
                 */
                //var strName = sFileName.split('.')[0];
                //if(strName.length > 200)
                //  CID = strName.substring(0, 199);
                //else
                // CID = strName;
                CID = 'platinium'
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   5. Content ID 생성 END / End of Content ID generation                    = */
            /* ============================================================================== */

            if(makeDrm.getAPIType() == "XML") {
            /* ============================================================================== */
            /* =   6. 응답 데이타 생성 [XML] / Generating response data [XML]         = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Content ID 생성 성공 여부에 따른 XML 값을 생성하여 전달합니다.             = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Creates and responds XML data with Content ID generation result          = */
            /* = -------------------------------------------------------------------------- = */
            sResponse = "<?xml version='1.0' encoding='utf-8'?><RES>";
            sResponse = sResponse + "<ERROR>" + ERROR_CODE + "</ERROR>";
            /* = -------------------------------------------------------------------------- = */
            /* =   6-1. ERROR_CODE 값이 성공이 아닐 경우 MESSAGE를 Contnet ID대신 추가         = */
            /* = -------------------------------------------------------------------------- = */
            /* =   6-1. Adds error message if ERROR_CODE is not '0000'           = */
            /* = -------------------------------------------------------------------------- = */
            if (ERROR_CODE != "0000") {
                sResponse = sResponse + "<ERRMSG>" + MESSAGE + "</ERRMSG>";
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   6-2. ERROR_CODE 값이 성공일 경우 Contnet ID 값을 추가              = */
            /* = -------------------------------------------------------------------------- = */
            /* =   6-2. Adds Content ID value if ERROR_CODE is '0000'            = */
            /* = -------------------------------------------------------------------------- = */
            else {
                sResponse = sResponse + "<CID>" + CID + "</CID>";
            }
            sResponse = sResponse + "<NONCE>" + sNonce + "</NONCE></RES>";
            console.log("[Result XML]: " + sResponse);
            /* = -------------------------------------------------------------------------- = */
            /* =   6. 응답 데이타 생성 [XML] END / End of response data generation [XML]        = */
            /* ============================================================================== */
            } else { // JSON type
                var jsonResponse = {
                    "error_code": ERROR_CODE,
                    "error_message": MESSAGE,
                    "cid": CID,
                    "nonce": sNonce
                };
                sResponse = JSON.stringify(jsonResponse);
            }

            /* ============================================================================== */
            /* =   7. 응답 데이타 암호화 / Encryption of response data                           = */
            /* = -------------------------------------------------------------------------- = */
            /* =   응답 데이터를 생성하여 반환합니다.                                                 = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Encrypts data to respond                                             = */
            /* = -------------------------------------------------------------------------- = */
            var sEncrypted = makeDrm.encrypt(sResponse);

            return sEncrypted;
            /* = -------------------------------------------------------------------------- = */
            /* =   7. 응답 데이타 암호화 END / End of response data encryption                   = */
            /* ============================================================================== */
        }
    };
})();
