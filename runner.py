''' This script for running automation test cases. For this, need to have python3 version or higher '''
import shutil
from sys import version_info, version
import configparser
import argparse
import os
import logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
import os
import requests
import base64
from datetime import datetime

config_file = "run.config"
SUIT_IDS = {
        "@Critical_Path":"87764"
    }

''' Parses and adds command line arguments for script to use for automation run. '''
def parse_arguments():
    arg_parser = argparse.ArgumentParser(description="VSU Automation run", formatter_class=argparse.RawTextHelpFormatter)
    arg_parser.add_argument("-bp", "--browsersPath", type=str, help=
        '\n\tOverride default installed browsers path using environment variables to run \n'
        '\tdefault is ms-playwright\n'
        f'\n\texample(s) in {config_file} file: PLAYWRIGHT_BROWSERS_PATH=ms-playwright \n'
        '\n\texample(s) for script arguments: -bp=ms-playwright\n'
    )
    arg_parser.add_argument("-b", "--browsers", type=str, help=
        '\n\tRunning the automation on specified browsers\n'
        '\tdefault is chrome\n'
        f'\n\texample(s) in {config_file} file: BROWSERS=chromium, BROWSERS=firefox\n'
        '\tBROWSERS=webkit, BROWSERS=all\n'
        '\n\texample(s) for script arguments: -b=chromium, -b=firefox, -b=webkit, -b=all\n'
    )
    arg_parser.add_argument("-testFilePath", type=str, nargs='?', help=
        '\n\tTest file name: Choose test file name or tests dir name\n'
        '\n\texample(s) for script arguments: -testFilePath=src/tests/\n',
        default=os.path.join('src', 'tests')
    )
    arg_parser.add_argument("-hd", "--headed", type=str,  help=
        '\n\tRunning the automation with/without GUI to open the browsers\n'
        '\tdefault is true\n'
        f'\n\texample(s) in {config_file} file: HEADED=true\n'
        '\n\texample(s) for script arguments: -hd=true, -hd=flase\n'
        '\t(please note, that inside docker only headed mode is used)\n'
    )
    arg_parser.add_argument("-d", "--debug", action='store_true',  help=
        '\n\tRun tests with Playwright Inspector.\n'
        '\n\tPlease note that headed mode does not work in this mode.\n'
        '\tdefault is false\n'
        f'\n\texample(s) in {config_file} file: DEBUG=false\n'
        '\n\texample(s) for script arguments: -d or --debug\n'
        '\t(please note, that inside docker only debug mode is false used)\n'
    )
    arg_parser.add_argument("-t", "--workers", type=str, help=
        '\n\tParallel run of automated cases\n'
        '\tdefault is 1\n'
        f'\n\texample(s) in {config_file} file: WORKERS=2, WORKERS=5\n'
        '\n\texample(s) for script arguments: -t=2, -t=5\n'
    )
    arg_parser.add_argument("-gr", "--grep", type=str, help=
        '\n\tThe filters run only tests matching this regular expression\n'
        '\t(see them at the top of each test case)\n'
        '\tby default no filters are provided\n'
        f'\n\texample(s) in {config_file} file: FILTER=critical, FILTER=smoke\n'
        '\tFILTER=smoke, FILTER=positive\n'
        '\n\texample(s) for script arguments: -g=critical, -g=positive\n'
        '\t-g=smoke\n'
    )
    arg_parser.add_argument("-sm", "--skip", type=str, help=
        '\n\tSkipping npm modules install\n'
        '\tdefault is false\n'
        f'\n\texample(s) in {config_file} file: SKIP_MODULE_INSTALL=true\n'
        '\n\texample(s) for script arguments: -sm=true\n'
    )
    arg_parser.add_argument("-g", "--generate-report", action='store_true', help=
        '\tGenerate allure report from run results and open it\n'
    )
    arg_parser.add_argument("-c", "--clear-allure", action='store_true', help=
        '\tDelete allure report and results folders before runing test and generate new folders\n'
    )
    arg_parser.add_argument("-tr", "--sendToTestRail", type=str, help=
    '\n\tEnable TestRail integration. Add test run results to TestRail\n'
    '\tdefault is false\n'
    f'\n\texample(s) in {config_file} file: TEST_RAIL_INTEGRATION=false\n'
    '\n\texample(s) for script arguments: -tr=false\n'
    )
    arg_parser.add_argument("-rId", "--runId", type=str, help=
    '\n\tTestRail Test Run id\n'
    f'\n\texample(s) in {config_file} file: RUN_ID=105622\n'
    '\n\texample(s) for script arguments: -rId or --runId\n'
    '\t(please note, that test run results added to the test run in TestRail, only when TEST_RAIL_INTEGRATION = true)\n'
    )
    return arg_parser.parse_args()


''' Set commandline argument or default value for WORKERS option, it it absent in "run.config" file '''
def set_workers(args, parser):
    if args.workers is not None:
        logging.info("Setting workers for parallel run from commandline argument : WORKERS : " + args.workers)
        parser.set("config", "WORKERS", args.workers)
    elif parser.has_option("config", "WORKERS") and parser.get("config", "WORKERS") != "":
        logging.info(f"Setting thread count for parallel run from {config_file} file : WORKERS : " + parser.get('config', 'WORKERS'))
    else:
        logging.info("Setting workers default value : WORKERS : 1")
        parser.set("config", "WORKERS", "1")
    os.environ["WORKERS"] = f"{parser.get('config', 'WORKERS')}"


''' Set commandline argument or default value for HEADED option, it it absent in "run.config" file '''
def set_headed(args, parser):
    if args.headed == "false":
        logging.info("Setting headed for parallel run from commandline argument : HEADED : false")
        parser.set("config", "HEADED", "--headed")
    elif args.headed == "true":
        logging.info("Setting headed for parallel run from commandline argument : HEADED : true")
        logging.info(args.headed)
        parser.set("config", "HEADED", "")
    elif parser.has_option("config", "HEADED") and parser.get("config", "HEADED") != "false":
        logging.info(f"Setting headed for parallel run from {config_file} file : HEADED : " + parser.get('config', 'HEADED'))
        parser.set("config", "HEADED", "")
    else:
        logging.info("Setting headed default value : HEADED : false")
        parser.set("config", "HEADED", "--headed")

''' Set commandline argument or default value for DEBUG option, it it absent in "run.config" file '''
def set_debug(args, parser):
    if args.debug is not False:
        logging.info("Setting run debug from commandline argument : DEBUG : false")
        parser.set("config", "DEBUG", "--debug")
    elif parser.has_option("config", "DEBUG") and parser.get("config", "DEBUG") != "false":
        logging.info(f"Setting run debug from {config_file} file : DEBUG : " + parser.get('config', 'DEBUG'))
        parser.set("config", "DEBUG", "--debug")
    else:
        logging.info("Setting DEBUG default value : DEBUG : false")
        parser.set("config", "DEBUG", "")


''' Set commandline argument or default value for FILTER option, it it absent in "run.config" file '''
def set_filters(args, parser):
    if args.grep is not None:
        logging.info("Setting filter for parallel run from commandline argument : FILTER : " + args.grep)
        parser.set("config", "FILTER", args.grep)
    elif  parser.has_option("config", "FILTER") and parser.get("config", "FILTER") != "":
        logging.info(f"Setting filter for parallel run from {config_file} file : FILTER : " + parser.get('config', 'FILTER'))
        parser.set("config", "FILTER", f"{parser.get('config', 'FILTER')}")
    else:
        logging.info("Setting browsers default value : FILTER : smoke")
        parser.set("config", "FILTER", "smoke")


''' Set commandline argument or default value for BROWSERS option, it it absent in "run.config" file '''
def set_browsers(args, parser):
    if args.browsers is not None:
        logging.info("Setting browsers for parallel run from commandline argument : BROWSERS : " + args.browsers)
        parser.set("config", "BROWSERS", args.browsers)
    elif  parser.has_option("config", "BROWSERS") and  parser.get("config", "BROWSERS") != "":
        logging.info(f"Setting browsers for parallel run from {config_file} file : BROWSERS : " + parser.get('config', 'BROWSERS'))
    else:
        logging.info("Setting browsers default value : BROWSERS : chromium")
        parser.set("config", "BROWSERS", "chromium")

''' Set commandline argument or default value for PLAYWRIGHT_BROWSERS_PATH option'''
def set_browsersPath(args, parser):
    if args.browsersPath is not None:
        logging.info("Setting PLAYWRIGHT_BROWSERS_PATH from commandline argument : PLAYWRIGHT_BROWSERS_PATH : " + args.browsersPath)
        os.environ["PLAYWRIGHT_BROWSERS_PATH"] = f"{args.browsersPath}"
    elif parser.has_option("config", "PLAYWRIGHT_BROWSERS_PATH") and parser.get("config", "PLAYWRIGHT_BROWSERS_PATH") != "":
        logging.info(f"Setting PLAYWRIGHT_BROWSERS_PATH from {config_file} file : PLAYWRIGHT_BROWSERS_PATH : " + parser.get('config', 'PLAYWRIGHT_BROWSERS_PATH'))
        os.environ["PLAYWRIGHT_BROWSERS_PATH"] = f"{parser.get('config', 'PLAYWRIGHT_BROWSERS_PATH')}"
    else:
        projectPath=os.path.join(os.getcwd(), "ms-playwright")
        logging.info(f"Setting env default value : PLAYWRIGHT_BROWSERS_PATH : {projectPath}")
        os.environ["PLAYWRIGHT_BROWSERS_PATH"] = projectPath


''' Set commandline argument or default value for SKIP_MODULE_INSTALL option, it it absent in "run.config" file '''
def set_skip_module_install(args, parser):
    if args.skip is not None:
        logging.info("Setting skip module install for parallel run from commandline argument : SKIP_MODULE_INSTALL : " + args.skip)
        parser.set("config", "SKIP_MODULE_INSTALL", args.skip)
    elif parser.has_option("config", "SKIP_MODULE_INSTALL") and parser.get("config", "SKIP_MODULE_INSTALL") == "false":
        logging.info("Installing required modules")
        logging.info(os.system("npm install"))
    else:
        logging.info("Skipping npm install command")


''' Generate allure report and open it '''
def generate_allure_report():
    logging.info("Generating allure report")
    logging.info("COMMAND:: ")
    command = f"{os.path.join('node_modules', '.bin', 'allure')} generate --clean"
    logging.info(command)
    os.system(command)

'''Delete Allure results and report folders'''
def clear_allure():
    logging.info("Deleting allure-report and allure-results folders")
    if  os.path.exists('./allure-report'):
        shutil.rmtree('./allure-report')
    if  os.path.exists('./allure-results'):
        shutil.rmtree('./allure-results')

'''Delete Collected apis folder and sub folders'''
def clear_collect_apis():
    logging.info("Deleting Collected apis folder and sub folders")
    if  os.path.exists('./src/collected_apis/local'):
        shutil.rmtree('./src/collected_apis/local')
    if  os.path.exists('./src/collected_apis/qa1'):
        shutil.rmtree('./src/collected_apis/qa1')

''' Set commandline argument or default value for TEST_RAIL_INTEGRATION option, if it absent in "run.config" file '''
def  set_send_to_test_rail(args, parser):
    if args.sendToTestRail is not None:
        logging.info("Setting run sendToTestRail from commandline argument : TEST_RAIL_INTEGRATION : " + args.sendToTestRail)
        parser.set("config", "TEST_RAIL_INTEGRATION", args.sendToTestRail)
    elif parser.has_option("config", "TEST_RAIL_INTEGRATION") and parser.get("config", "TEST_RAIL_INTEGRATION") != "":
        logging.info(f"Setting run sendToTestRail from {config_file} file : TEST_RAIL_INTEGRATION : " + parser.get('config', 'TEST_RAIL_INTEGRATION'))
    else:
        logging.info("Setting TEST_RAIL_INTEGRATION default value : TEST_RAIL_INTEGRATION : false")
        parser.set("config", "TEST_RAIL_INTEGRATION", "false")
    os.environ["TEST_RAIL_INTEGRATION"] = f"{parser.get('config', 'TEST_RAIL_INTEGRATION')}"


''' Set commandline argument or default value for RUN_ID option, if it absent in "run.config" file '''
def set_run_id(args, parser):
    if args.runId is not None:
        logging.info("Setting runId from commandline argument : RUN_ID: " + args.runId)
        parser.set("config", "RUN_ID", args.runId)
    elif parser.has_option("config", "RUN_ID") and parser.get("config", "RUN_ID") != "":
        logging.info(f"Setting thread count for parallel run from {config_file} file : RUN_ID : " + parser.get('config', 'RUN_ID'))
    else:
        logging.info("Setting runId default value : RUN_ID ''")
        parser.set("config", "RUN_ID", "")
    os.environ["RUN_ID"] = f"{parser.get('config', 'RUN_ID')}"

'''Create test run'''
def create_test_run(parser, project_id=57):
    run_id = parser.get('config', 'RUN_ID')
    test_rail_integration =  parser.get('config', 'TEST_RAIL_INTEGRATION')
    baseURL = "https://2023testingvsu.testrail.io/"
    api_key = "l3ys9AtsLnzSdxYCo6mj-cX1bOffvVCagGro.9Lzr"
    user_name = "kochinyan1992"
    filter= parser.get('config', 'FILTER')
    product_version = os.environ.get("PRODUCT_VERSION")
    now = datetime.now()
    format = "%d.%m.%Y"
    date = now.strftime(format)
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{user_name}:{api_key}'.encode()).decode()}",
        "Content-Type": "application/json"
    }
    if test_rail_integration.lower()==("true"):
        if filter not in SUIT_IDS:
            raise Exception(f"The provided {filter} filter isn't a valid suit name to create a TestRail Run or isn't added to the expected suit ids.")
        if not run_id:
            try:
                suite_id = SUIT_IDS[filter]
                runName = f"Automation | Festival | {parser.get('config', 'ENV')} | {product_version} | {date}"
                get_endpoint = f"/index.php?/api/v2/get_cases/{project_id}&suite_id={suite_id}"
                get_response = requests.get(baseURL + get_endpoint, headers=headers)
                get_response.raise_for_status()
                response_data = get_response.json()
                filtered_cases = [case for case in response_data["cases"] if case.get("custom_automation_status") == 1]
                case_ids = [case["id"] for case in filtered_cases]
                endpoint = f"/index.php?/api/v2/add_run/{project_id}"
                data = {
                    "suite_id": suite_id,
                    "name": runName,
                    "include_all": False,
                    "case_ids": case_ids,
                }
                response = requests.post(baseURL + endpoint, json=data, headers=headers)
                response.raise_for_status()
                run_id = response.json()["id"]
                os.environ["RUN_ID"] = str(run_id)
                return response.json()
            except requests.exceptions.RequestException as error:
                raise Exception(f"Cannot proceed with tests execution as TestRail Run creation is Failed: \n TestRail API request error: {error}")


def set_configs(args):
    parser = configparser.ConfigParser()
    if os.path.isfile(config_file):
        parser.read(os.path.basename(config_file))
    else:
        parser.add_section("config")
    set_browsersPath(args, parser)
    set_browsers(args, parser)
    set_workers(args, parser)
    set_headed(args, parser)
    set_debug(args, parser)
    set_filters(args, parser)
    set_skip_module_install(args, parser)
    set_send_to_test_rail(args, parser)
    set_run_id(args, parser),
    return parser


''' Run all test cases by given path '''
def run_tests(args, parser):
    logging.info("Running cases...")
    logging.info("PLAYWRIGHT_BROWSERS_PATH="  + os.environ["PLAYWRIGHT_BROWSERS_PATH"])
    command = f"npx playwright test  {args.testFilePath} --browser={parser.get('config', 'BROWSERS')} --workers={parser.get('config', 'WORKERS')} {parser.get('config', 'HEADED')} --grep={parser.get('config', 'FILTER')}  {parser.get('config', 'DEBUG')}"
    logging.info("COMMAND:: " +  command)
    return os.system(command)


def main():
    logging.info(f'''The configs are taken with the following order:
            1. command line arguments passed to the script
            2. run options set in {config_file} file (recommended)
            3. default values for these options (in case the above options are absent)
    ''')
    if not os.path.isfile(config_file):
        logging.info(f"The {config_file} file does not exist. Please create it, otherwise use commandline arguments or default values will be used")
    args = parse_arguments()
    parser = set_configs(args)
    create_test_run(parser)
    # if args.clear_allure is not False:
    clear_allure()
    clear_collect_apis()
    run_status = run_tests(args, parser)
    if args.generate_report is not False:
        generate_allure_report()
    if run_status > 0:
        exit(1)


if __name__ == "__main__":
    main()