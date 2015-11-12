#!/bin/sh

usage() {
    echo "***********************************************************************************"
    echo "Usage:     $0 --crowdin-api-key=<key> [--branch-name=<branch>]"
    echo ""
    echo "  --crowdin-api-key the crowdin api key of crowdin project (bonita-bpm-new-features)"
    echo "  --branch-name branch name to upload to crowdin (default to master)"
    echo "***********************************************************************************"
    exit 1;
}

# $1 directory
npm_pot() {
    cd $1
    npm install && npm run pot
    check_errors $? "Error while generating pot files"
    cd -
}

# $1 previous command exit code
# $2 error message
check_errors() {
  if [ $1 -ne 0 ]
  then
    echo $2
    exit $1
  fi
}

SCRIPT_DIR=$(dirname $(readlink -f "$0"))
BUILD_DIR=$SCRIPT_DIR
BASE_DIR=$SCRIPT_DIR/..

PROJECT="bonita-bpm-new-features"
BRANCH_NAME=master
for i in "$@"; do
    case $i in
        --crowdin-api-key=*)
        CROWDINKEY="${i#*=}"
        shift
        ;;
        --branch-name=*)
        BRANCH_NAME="${i#*=}"
        shift
        ;;
    esac
done
if [ -z "$CROWDINKEY" ]; then
  echo "ERROR crowdin API key is needed";
  usage;
fi

echo "***********************************************************************************"
echo "Portal js TRANSLATION UPLOAD"
echo "***********************************************************************************"
cd $BASE_DIR

echo "Building pot files..."
npm_pot .

echo "Concatenating bonita-js-components and bonita-portal-js pot files..."
# concatenate bonita-js-components keys with bonita-portal-js keys
msgcat ./main/assets/bonita-js-components/i18n/bonita-js-components.pot $BUILD_DIR/portal-js.pot | msguniq -s > $BUILD_DIR/portal-js.pot
check_errors $? "Error while concatenating pot files"

echo "Exporting community pot to $PROJECT crowdin project ..."
curl -F "files[$BRANCH_NAME/bonita-web/portal/portal-js.pot]=@$BUILD_DIR/portal-js.pot"  \
     -F "export_patterns[$BRANCH_NAME/bonita-web/portal/portal-js.pot]=/$BRANCH_NAME/bonita-web/portal/portal-js_%locale_with_underscore%.po" \
   https://api.crowdin.com/api/project/$PROJECT/update-file?key=$CROWDINKEY
check_errors $? "Error while uploading pot file"
