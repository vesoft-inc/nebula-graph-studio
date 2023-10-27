export default {
  common: {
    requestError: 'Request Error',
    currentSpace: 'Current Graph Space',
    seeTheHistory: 'History',
    table: 'Table',
    log: 'Log',
    sorryNGQLCannotBeEmpty: 'nGQL cannot be empty',
    disablesUseToSwitchSpace: 'DO NOT switch between graph spaces with nGQL statements in the console.',
    NGQLHistoryList: 'nGQL History',
    empty: 'Clear',
    run: 'Run',
    console: 'Console',
    ok: 'OK',
    success: 'Success',
    fail: 'Fail',
    cancel: 'Cancel',
    confirm: 'Confirm',
    import: 'Import',
    ask: 'Are you sure to proceed?',
    openInExplore: 'Open In Explorer',
    schema: 'Schema',
    create: 'Create',
    name: 'Name',
    operation: 'Operations',
    delete: 'Delete',
    optional: 'Optional',
    exportNGQL: 'View nGQL',
    relatedProperties: 'Related Properties',
    type: 'Type',
    edit: 'Edit',
    deleteSuccess: 'Deleted successfully',
    propertyName: 'Property Name',
    dataType: 'Data Type',
    allowNull: 'Allow Null',
    defaults: 'Defaults',
    addProperty: 'Add Property',
    updateSuccess: 'Updated Successfully',
    add: 'Add',
    tag: 'Tag',
    edge: 'Edge Type',
    index: 'Index',
    yes: 'Yes',
    no: 'No',
    graph: 'Graph',
    color: 'Color',
    total: 'Total',
    namePlaceholder: 'Please enter the {name} name',
    comment: 'Comment',
    space: 'Space',
    version: 'Version',
    statistics: 'Statistics',
    duplicate: 'Copy',
    copy: 'Copy',
    copySuccess: 'Copied successfully',
    sketch: 'Schema drafting',
    viewSchema: 'View Schema',
    beta: 'Beta',
    danglingEdge: 'Dangling edge',
    columnName: 'Column name',
    src: 'Source',
    dst: 'Destination',
    value: 'Value',
    continue: 'Continue',
    update: 'Update',
    prev: 'Previous',
    createTime: 'Create Time',
    rerun: 'Rerun',
    keyword: 'Keyword',
    function: 'Function',
    historyRecord: 'History',
  },
  doc: {
    welcome: 'Welcome to',
    functionIntro: 'Functions introduction',
    schemaIntro: `You can use the Schema page to operate graph spaces in ${window.gConfig.databaseName}`,
    importIntro: `You can use the Import page to batch import vertex and edge data into ${window.gConfig.databaseName} for graph exploration and data analysis.`,
    consoleIntro: 'When data is imported, you can use the Console page to query graph data.',
    learningDoc: 'Learning Docs',
    getStarted: `Getting started with ${window.gConfig.databaseName} Studio`,
    getStartedTip: `What's ${window.gConfig.databaseName} Studio`,
    useGuide: `Documents of ${window.gConfig.databaseName} Studio`,
    useGuideTip: `Learn how to use ${window.gConfig.databaseName} Studio`,
    ngqlIntro: `${window.gConfig.databaseName} Query Language (nGQL)`,
    ngqlIntroTip: `nGQL is a declarative graph query language for ${window.gConfig.databaseName}. It allows expressive and efficient graph patterns. `,
    start: 'Get Started',
    sketchIntro:
      'You can design your schemas on the canvas to visually display the relationships between vertices and edges.',
    basketballplayerIntro:
      'A typical schema composed of two vertex types (player and team) and two edge types (serve and follow), widely referenced by documentation.',
    snsIntro: 'Social Network Graph demo, new friend recommendation, feed generation, etc.',
    movieIntro: 'Movie recommendation with CBF, ItemCF and UserCF in Graph.',
    datalineageIntro: `Metadata governance on ${window.gConfig.databaseName}, data lineage query, data dependency analysis, etc.`,
    idMappingIntro: 'ID Mapping, Identity Resolution for a user system in Graph',
    fifa2022Intro:
      "2022 Football World Game knowledge graph, try predict the winner, assuming we don't know the result.",
    shareholdingIntro:
      'Shareholding graph, query the shareholding relationship of a company, and the relationship between the company and the shareholder.',
    openstackIntro:
      'A demo of AI Ops with Graph, taking OpenStack as an example, where all resources were included in one graph.',
    fraudDetectionIntro: 'Fraud detection with Graph, taking loan application as an example',
    supplychainIntro: 'Auto Manufacturing Supply Chain Graph.',
  },
  warning: {
    connectError: 'Connection refused, please configure server again',
    crashPage: 'Oops, something went wrong',
    crashPageTip: 'Service crashed, please contact administrator',
    refreshPage: 'Refresh page',
    contactStaff: 'Contact Us',
    errorMessage: 'Error Message',
  },
  configServer: {
    connect: 'Connect',
    host: 'Graphd IP address',
    port: 'Port',
    username: 'Username',
    password: 'Password',
    clear: 'Log out',
    title: `Connect to ${window.gConfig.databaseName}`,
    tip: "Don't know the address? Docs->",
  },
  formRules: {
    hostRequired: 'Host Required',
    portRequired: 'Port Required',
    usernameRequired: 'Username Required',
    passwordRequired: 'Password Required',
    positiveIntegerRequired: 'Please enter a non-negative integer',
    nameValidate: 'The name must start with a letter, and it only supports English letters, numbers and underscores',
    nameRequired: 'Please enter the name',
    numberRequired: 'Please enter a positive integer',
    replicaLimit: 'Replica factor must not exceed the number of your current online machines({number})',
    ttlRequired:
      'Please select the corresponding property, and the data type of the property must be integer or timestamp',
    ttlDurationRequired: 'Please enter the time (in seconds)',
    dataTypeRequired: 'Please select the data type',
    edgeTypeRequired: 'Please select the edge type',
    srcIdRequired: 'Please select the source VID',
    dstIdRequired: 'Please select the destination VID',
    vidRequired: 'Please select the VID',
    vidTypeRequired: 'Vid type is required',
    fixStringLengthRequired: 'fix string length limit is required',
    spaceRequired: 'Space is required',
    maxBytes: 'It cannot exceed {max} bytes',
    ttlLimit: 'The data type of the property must be int or timestamp',
    associateNameRequired: 'Associated {type} name is required',
    fileRequired: 'Please select the file',
    formHostRequired: 'Host Required',
    formPortRequired: 'Port Required',
    regionRequired: 'Region Required',
    endpointRequired: 'Endpoint Required',
    bucketRequired: 'Bucket Required',
    accessKeyIdRequired: 'Access Key ID Required',
    accessKeySecretRequired: 'Access Key Secret Required',
    platformRequired: 'Platform Required',
  },
  console: {
    execTime: 'Execution Time',
    exportVertex: 'Please choose the column representing vertex IDs from the table',
    exportEdge: 'Please choose the columns representing source vertex ID, destination vertex ID, and rank of an edge',
    deleteHistory: 'Clear History',
    cypherParam: 'Cypher Parameter',
    favorites: 'Favorites',
    addToFavorites: 'Add to favorites',
    unfavorite: 'Unfavorite',
    clearFavorites: 'Clear Favorites',
    graphviz: 'Graphviz',
    selectSpace: 'Please select Graph Space',
    historyTip: 'You can directly use the "/" key in the console to quickly select historical query statements.',
    runSelectionRows: 'Run selected rows',
    selectEmpty: 'Please select the row',
  },
  explore: {
    vertexStyle: 'Vertex Color',
    notExist: 'Not exist',
    expandItem: 'Expand',
    collapseItem: 'Collapse',
  },
  import: {
    uploadFile: 'Upload Files',
    dataSourceManagement: 'Data Source Management',
    importData: 'Import Data',
    createTask: 'New Import',
    uploadTemp: 'Import Template',
    downloadConfig: 'Download Config',
    downloadLog: 'Download Log',
    viewLogs: 'View Logs',
    details: 'Details',
    task: 'import task',
    taskList: 'Task List',
    taskName: 'Task Name',
    tag: 'Map Tags',
    edge: 'Map Edges',
    runImport: 'Import',
    fileName: 'File Name',
    withHeader: 'Header',
    fileSize: 'Size',
    fileTitle: 'File list',
    bindDatasource: 'Add source file',
    endImport: 'Stop Import',
    prop: 'Prop',
    mapping: 'CSV Index',
    edgeText: 'Edge',
    choose: 'Mapping',
    ignore: 'Ignore',
    vertexText: 'Vertex',
    indexNotEmpty: "column index can't be null.",
    enterPassword: `Please enter the ${window.gConfig.databaseName} account password to continue`,
    isEmpty: 'is empty',
    startImporting: 'Start importing',
    stopImportingSuccess: 'Stop import successfully.',
    deleteSuccess: 'Delete task successfully',
    batchSize: 'Batch Size',
    importCompleted: 'Import completed',
    importStopped: 'Import stopped',
    importFailed: 'Failed',
    importRunning: 'Running',
    importPending: 'Pending',
    notImported: '{total} records not imported',
    selectFile: 'Select file',
    addTag: 'Add Tag',
    addEdge: 'Add Edge Type',
    selectTag: 'Select Tag',
    selectEdge: 'Select Edge Type',
    config: 'Task Config',
    parseFailed: 'File parsing failed',
    uploadTemplate: 'Drag & drop the YAML configuration file to this area',
    uploadBoxTip:
      'The YAML configuration file is used to describe information about the files to be imported, the database server, and more. ',
    fileUploadRequired:
      '1. Please make sure all CSV data files are uploaded before import the YAML file. If not, please go to ',
    fileUploadRequired2: ' first.',
    exampleDownload: '2. An example for the configuration file: ',
    uploadTemplateTip:
      '3. Configure the Yaml file: please keep only the file name (retain the file extension) for all file paths (path, logPath) in the template, e.g. logPath: config.csv',
    reUpload: 'Re-upload',
    fileNotExist: '{name} file does not exist！',
    importYaml: 'Import the YAML file',
    templateMatchError: 'The user in the configuration does not match the current login account',
    uploadSuccessfully: 'Upload files successfully.',
    fileSizeLimit:
      '{name} is too large and exceeds the upload limit({size}), please upload the file to the data/upload directory under the installation directory via scp',
    noHttp: 'The address in the configuration file does not support http protocol, please remove http(s)://',
    addressMatch:
      'The address in the configuration file must contain the Graph address of current login connection. Separate multiple addresses with ',
    dataSourceFile: 'Data source file',
    vidColumn: 'VID column',
    srcVidColumn: 'Source VID column',
    dstVidColumn: 'Destination VID column',
    vidFunction: 'VID function',
    vidPrefix: 'VID prefix',
    vidSuffix: 'VID suffix',
    concurrencyTip: `Number of ${window.gConfig.databaseName} client concurrency.`,
    batchSizeTip: 'The number of statements inserting data in a batch.',
    retryTip: 'Retry times of nGQL statement execution failures.',
    vidFunctionTip: 'Function to generate VID. Currently only hash functions are supported.',
    vidPrefixTip: 'prefix added to the original vid.',
    vidSuffixTip: 'suffix added to the original vid.',
    selectCsvColumn: 'Select CSV Index',
    graphAddress: 'Graph service address',
    concurrency: 'Concurrency',
    retry: 'Retry',
    graphAddressTip: 'The following Graph host will be used for data import',
    currentHost: 'Current connected host',
    expandMoreConfig: 'Expand more configurations',
    pickUpConfig: 'Pick up more configurations',
    tagRequired: 'Please select tag',
    edgeRequired: 'Please select edge type',
    tagFileRequired: 'Please add tag source file',
    edgeFileRequired: 'Please add edge source file',
    tagFileSelect: 'Please select tag source file',
    edgeFileSelect: 'Please select edge source file',
    configDisplay: 'These data files will be loaded',
    loadToTag: 'Load {file} to tag {name}',
    loadToEdge: 'Load {file} to edge type {name}',
    importConfirm: 'Import task confirm',
    delimiter: 'Delimiter',
    previewFiles: 'Preview file list',
    sampleData: 'Sample data',
    hasHeader: 'Has header',
    noHeader: 'No header',
    enterDelimiter: 'Enter delimiter',
    applicateToAll: 'Apply to all files',
    deleteFiles: 'Delete select files',
    fileRepeatTip: 'These files are already exists, continuing to upload will overwrite the original file',
    filePreview: 'Preview file {name}',
    uploadConfirm: 'Upload Confirm',
    localFiles: 'Local files',
    s3: 'Object Storage',
    sftp: 'SFTP',
    newDataSource: 'New Data Source',
    editDataSource: 'Edit Data Source',
    deleteDataSource: 'Delete Data Source',
    datasourceList: '{type} list',
    ipAddress: 'IP Address:Port',
    bucketName: 'Bucket Name',
    accessKeyId: 'AccessKeyId',
    region: 'Region',
    createTime: 'Add Date',
    endpoint: 'Endpoint',
    accessKeySecret: 'AccessKeySecret',
    dataSourceType: 'Data Source Type',
    selectPlatform: 'Select platform',
    enterAddress: 'Enter endpoint',
    enterRegion: 'Enter region',
    serverAddress: 'Server Address',
    port: 'Port',
    newDataSourceTip: 'Please add the data source for the first time',
    addNewImport: 'Add New Import',
    addNewImportTip: 'After adding the data source, create an import task to import the data into the database',
    start: 'Start',
    s3Tip: 'Only support cloud services that compatible with the Amazon S3 interface',
    readerConcurrency: 'Reader concurrency',
    readerConcurrencyTip: 'The number of concurrent readers that read data from the data source',
    importerConcurrency: 'Importer concurrency',
    importerConcurrencyTip: `The number of concurrent importers that import data into ${window.gConfig.databaseName}`,
    selectDatasourceFile: 'Select Data Source file',
    datasourceType: 'Data Source Type',
    filePath: 'File Path',
    directory: 'Directory',
    preview: 'Preview',
    customize: 'Customize',
    s3Platform: 'S3 compatible Service Provider',
    account: 'Account',
    endpointTip: 'Please use an endpoint without a bucket name in the domain name, e.g. {sample}',
    awsTip: 'https://s3.us-east-2.amazonaws.com',
    ossTip: 'https://oss-cn-hangzhou.aliyuncs.com',
    cosTip: 'https://cos.ap-shanghai.myqcloud.com',
    customizeTip: 'http://127.0.0.1:9000',
    addressRequired: 'Please enter the import address in the configuration file',
    usernameRequired: 'Please enter the username in the configuration file',
    passwordRequired: 'Please enter the password in the configuration file',
    s3AccessKeyRequired: 'Please enter the s3 accessKeyID in the configuration file',
    s3SecretKeyRequired: 'Please enter the s3 accessKeySecret in the configuration file',
    sftpUsernameRequired: 'Please enter the sftp username in the configuration file',
    sftpPasswordRequired: 'Please enter the sftp password in the configuration file',
    ossAccessKeyRequired: 'Please enter the oss accessKeyID in the configuration file',
    ossSecretKeyRequired: 'Please enter the oss accessKeySecret in the configuration file',
    draft: 'Draft',
    saveDraft: 'Save Draft',
    modifyTime: 'Modify time',
    taskNameRequired: 'Please enter the task name and select space',
    fileMissing: '{files} does not exist, please re-upload the file',
    datasourceMissing:
      'The related data source of {files} is not found, please re-add the related datasource and reconfigure the task',
    templateRerunTip:
      'The task generated by template import does not support editing, please directly modify the template file and import it.',
    rerunError: 'The task configuration record cannot be found, and the task cannot be rerun',
    editTaskError: 'Cannot find task configuration record, cannot continue editing',
    s3SafetyTip:
      'For your data safety, it is recommended to store only data import-related files in the Bucket and configure the Bucket to read-only mode.',
  },
  schema: {
    spaceList: 'Graph Space List',
    useSpaceErrTip:
      'Space not found. Trying to use a newly created graph space may fail because the creation is implemented asynchronously. To make sure the follow-up operations work as expected, Wait for two heartbeat cycles, i.e., 20 seconds.',
    createSuccess: 'Create Successfully',
    defineFields: 'Define Properties',
    uniqProperty: 'Property name cannot be duplicated',
    cancelOperation: 'Do you want to close this panel',
    cancelPropmt:
      'If you close the panel, the configuration will be deleted automatically. Are you sure that you want to close the panel?',
    fieldDisabled:
      'A TTL configuration is set for this property, so it cannot be edited. If you want to edit this property, delete the TTL configuration.',
    indexExist:
      'An index exists, so TTL configuration is not permitted. A tag or edge type cannot have both an index and TTL configuration.',
    indexType: 'Index Type',
    indexName: 'Index Name',
    indexFields: 'Indexed Properties',
    associateName: 'Associated {type} name',
    dragSorting: '(Drag to Sort)',
    selectFields: 'Please choose a property',
    indexedLength: 'Please enter indexed length',
    indexedLengthDescription:
      'Set the indexed string length. If you are indexing fixed strings, you must not set this option.',
    indexedLengthRequired: 'Indexed length must be a positive integer',
    rebuild: 'Rebuild',
    createSpace: 'Create Space',
    No: 'No',
    spaceName: 'Name',
    partitionNumber: 'Partition Number',
    replicaFactor: 'Replica Factor',
    charset: 'Charset',
    collate: 'Collate',
    vidType: 'Vid Type',
    group: 'Group',
    comment: 'Comment',
    operations: 'Operations',
    spaceNameEnter: 'Please enter the space name',
    propertyCount: 'Property Num',
    configTypeList: '{type} List',
    configTypeAction: '{action} {type}',
    timestampFormat:
      "Supported data inserting methods: <br />1. call function now()  <br />2. call function timestamp(), for example: timestamp('2021-07-05T06:18:43.984000')  <br />3. Input the timestamp directly, namely the number of seconds from 1970-01-01 00:00:00",
    dateFormat: "Supported data inserting methods: <br />Call function date(), for example: date('2021-03-17')",
    timeFormat: "Supported data inserting methods: <br />Call function time(), for example: time('17:53:59')",
    datetimeFormat:
      "Supported data inserting methods: <br />Call function datetime(), for example: datetime('2021-03-17T17:53:59')",
    geographyFormat:
      "Supported data inserting methods: <br /> Call function ST_GeogFromText(), for example:ST_GeogFromText('POINT(6 10)')",
    'geography(point)Format':
      "Supported data inserting methods: <br /> Call function ST_GeogFromText('POINT()'), for example:ST_GeogFromText('POINT(6 10)')",
    'geography(linestring)Format':
      "Supported data inserting methods: <br /> Call function ST_GeogFromText('LINESTRING()'), for example:ST_GeogFromText('LINESTRING(3 4,10 50,20 25)')",
    'geography(polygon)Format':
      "Supported data inserting methods: <br /> Call function ST_GeogFromText('POLYGON()'), for example:ST_GeogFromText('POLYGON((1 1,5 1,5 5,1 5,1 1),(2 2,2 3,3 3,3 2,2 2))')",
    durationFormat:
      'Supported data inserting methods: <br /> Call function duration(<map>), for example:duration({years: 1, seconds: 0})',
    setTTL: 'Set TTL (Time To Live)',
    refresh: 'Refresh',
    startStat: 'Start Stats',
    statTip: 'The statistics execution time is affected by the amount of data.',
    lastRefreshTime: 'Last refreshed time',
    statsType: 'Type',
    statsName: 'Name',
    statsCount: 'Count',
    statError: 'Stat failed, Please try again.',
    statFinished: 'Statistics end',
    deleteSpace: 'Delete Graph Space',
    clearSpace: 'Clear Graph Space',
    cloneSpace: 'Clone Graph Space',
    length: 'Length',
    selectVidTypeTip: 'Please select the type',
    csvDownload: 'Export CSV File',
    pngDownload: 'Export PNG File',
    rebuildSuccess: '{names} rebuild successfully',
    rebuildFailed: '{names} rebuild failed',
    startRebuildIndex: 'Start rebuilding the index {name}',
    getSchema: 'Get Schema',
    getSchemaTip: `Because there is no strong binding relationship between tags and edges in the current ${window.gConfig.databaseName} version, the results will be generated based on randomly obtained data, for reference only.`,
    danglingEdge: 'Dangling edge',
    showDDL: 'View Schema DDL',
    downloadNGQL: 'Download.nGQL',
    getDDLError: 'Failed to get the schema DDL, Please try again',
    totalVertices: 'Total Vertices Count',
    totalEdges: 'Total Edges Count',
  },
  empty: {
    stats: 'No Statistics Data',
    statsTip: 'Click the button to start statistics',
    tag: 'No Tag Data',
    tagTip: 'Click the button to create tag',
    edge: 'No Edge Data',
    edgeTip: 'Click the button to create edge',
    index: 'No Index Data',
    indexTip: 'Click the button to create index',
  },
  menu: {
    use: 'Use Manual',
    release: 'Release Note',
    forum: 'Help Forum',
    nGql: 'nGQL',
    feedback: 'Trouble Feedback',
    repo: 'GitHub Repo',
    trial: 'Enterprise Edition Trial',
    contact: 'Contact Us',
  },
  link: {
    nGQLHref: 'https://docs.nebula-graph.io/3.6.0/3.ngql-guide/1.nGQL-overview/1.overview/',
    mannualHref: 'https://docs.nebula-graph.io/3.6.0/nebula-studio/about-studio/st-ug-what-is-graph-studio/',
    startStudioHref: 'https://docs.nebula-graph.io/3.6.0/nebula-studio/quick-start/st-ug-plan-schema/',
    versionLogHref: 'https://docs.nebula-graph.io/3.6.0/20.appendix/release-notes/studio-release-note/',
    forumHref: 'https://discuss.nebula-graph.io/',
    feedback: 'https://app.slack.com/client/TJB3N2BPD/CJNFUM7AR',
    trial: 'https://www.nebula-graph.io/visualization-tools-free-trial',
    contact: 'https://www.nebula-graph.io/contact',
    loginHref: 'https://docs.nebula-graph.io/3.6.0/nebula-studio/deploy-connect/st-ug-connect/',
  },
  sketch: {
    dragTip: 'Drag and drop to the canvas',
    tag: 'Tag',
    edge: 'Edge Type',
    name: '{name} Name',
    detail: '{name} details',
    comment: 'Comment',
    properties: 'Properties',
    propertyName: 'Property Name',
    dataType: 'Data Type',
    addProperty: 'Add Property',
    type: 'type',
    list: 'Draft List',
    new: 'New',
    applyToSpace: 'Apply to Space',
    createSpace: 'Create New Space',
    selectSpace: 'Select Space',
    noCurrentSketch: 'No schema sketch selected',
    noCurrentSketchTips: 'Please select a schema sketch first',
    sketchInvalid: 'Please complete the current Schema information',
    saveSuccess: 'Save successfully',
    saveReminder: 'The current sketch has been modified but not saved, whether to continue to switch sketches?',
    saveTip: 'The current sketch has been modified but not saved, please save first.',
    confirmDelete: 'Sure to delete?',
    saveDraft: 'Save draft',
    export: 'Export',
    applySpaceTip: 'The new schema will not overwrite the original schema in the space',
    sameSchemaWarning:
      '{content} already exists in the space, please change the {hasType} name or select another space.',
    noData: 'No data, please import data first',
    uniqName: 'Tag & Edge type name cannot be duplicated',
    spaceExisted: 'Space already exists',
    updateNameSuccess: 'Update name successfully',
    search: 'Search name',
  },
  welcome: {
    guide: "Beginner's Guide",
    quickStart: 'Start',
    quickStartDesc: 'Documents',
    demos: 'Demos',
    starterDatasets: 'Starter Datasets',
    solutionDatasets: 'Solution Datasets',
    demoDownload: 'Download',
    demoDownloading: 'downloading',
    demoIntro: 'Demo Introduction',
    loadWaiting: 'Data is loading, please wait... It will end in {second}s',
    downloadSuccess: 'Dataset `{space}` has been downloaded successfully',
    spaceExist: 'The graph space `{space}` already exists',
    schemaModuleLink: 'https://docs.nebula-graph.io/3.6.0/nebula-studio/quick-start/st-ug-create-schema/',
    importModuleLink: 'https://docs.nebula-graph.io/3.6.0/nebula-studio/quick-start/st-ug-import-data/',
    consoleModuleLink: 'https://docs.nebula-graph.io/3.6.0/nebula-studio/quick-start/st-ug-console/',
    sketchModuleLink: 'https://docs.nebula-graph.io/3.6.0/nebula-studio/quick-start/draft/',
    basketballplayerDocLink: '',
    shareholdingDocLink: 'https://nebula-graph.io/demo/shared-holding',
    openstackDocLink: '',
    snsDocLink: 'https://siwei.io/en/nebulagraph-sns/',
    supplychainDocLink: 'https://github.com/wey-gu/supplychain-dataset-gen',
    datalineageDocLink: 'https://siwei.io/en/data-lineage-oss-ref-solution/',
    movieDocLink: '',
    idMappingDocLink: '',
    fraudDetectionDocLink: 'https://siwei.io/en/fraud-detection-with-nebulagraph/',
    fifa2022DocLink: 'https://siwei.io/en/chatgpt-and-nebulagraph-predict-fifa-world-cup/',
    alwaysShow: 'Always show the welcome page',
    progressTitle: 'Download & Import Data',
  },
};
