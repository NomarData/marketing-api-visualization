# -*- coding: utf-8 -*-
from pysocialwatcher import watcherAPI
watcher = watcherAPI()
watcher.load_data_and_continue_collection("credentials.csv")
watcher.check_tokens_account_valid()
dataframe = watcher.run_data_collection("data_collection_input.json")
dataframe.to_csv("final_data.csv")
