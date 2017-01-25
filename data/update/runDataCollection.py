# -*- coding: utf-8 -*-
from pysocialwatcher import watcherAPI
from postProcessDataToVisualization import PostProcessVisualizationData
import os

collected_file_name = "data.csv"

watcher = watcherAPI()
watcher.load_credentials_file("credentials.csv")
watcher.check_tokens_account_valid()
dataframe = watcher.run_data_collection("arabic_health_awareness.json")
dataframe.to_csv(collected_file_name)
os.system("rm dataframe_*.csv")
os.system("rm collect_*.csv")
postProcessData = PostProcessVisualizationData(collected_file_name)
postProcessData.process_data()
