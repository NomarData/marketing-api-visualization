import argparse
import pandas as pd

NULL_VALUE = "NOTSELECTED"


class PandasDataset:
	@staticmethod
	def get_age_range(row):
		min_age = row["min_age"]
		max_age = row["max_age"]
		if max_age == NULL_VALUE and min_age == 18:
			return "{}+".format(min_age)
		else:
			return "{}-{}".format(min_age, max_age)

	@staticmethod
	def get_pandas_dataset_from_file(filepointer):
		print "Reading data..."
		return pd.read_csv(filepointer.name)

	@staticmethod
	def get_expat_row(row_with_all, rows_with_locals):
		expat_row = row_with_all.copy()
		expat_row["citizenship"] = "Expats"
		import ipdb;ipdb.set_trace() TODO

		same_necessary_columns = ["interest","country_code","gender","language","age_range"]
		for column in same_necessary_columns:
			rows_with_locals = rows_with_locals[rows_with_locals[column] == row_with_all[column]]
		if len(rows_with_locals) != 1:
			raise Exception("Should have 1 and only 1 local_row that matchs")
		row_with_local = rows_with_locals.iloc[0]


	def replace_specific_key_value(self, column, old_value, new_value):
		print "Replacing : {}:{} por {}:{}".format(column,old_value,column,new_value)
		self.data.loc[self.data[column] == old_value, column] = new_value

	def insert_age_range_column(self):
		print "Inserting Age Range..."
		self.data["age_range"] = self.data.apply(lambda row: self.get_age_range(row), axis=1)

	def check_not_permitted_empty_values(self):
		print "Checking Not Permitted Empty Values..."
		no_nan_columns = ["country_code", "gender", "audience"]
		for column in no_nan_columns:
			if self.data[column].isnull().values.any():
				raise Exception("Not Allowed Null at:" + column)

	def replace_null_values(self):
		print "Replace Null Values..."
		self.data = self.data.fillna(NULL_VALUE)

	def check_data_integrity(self):
		print "Checking Data Integrity..."
		pass

	def delete_specific_key_value(self, key, value):
		print "Deleting specific key valye: {}:{}".format(key,value)
		self.data = self.data[self.data[key] != value]

	def rename_column(self,old_name,new_name):
		print "Renaming: {}->{}".format(old_name, new_name)
		columns_names = {old_name : new_name}
		self.data = self.data.rename(columns=columns_names)

	def insert_expats_native_rows(self):
		print "Adding Not Native Rows"
		rows_with_all = self.data[self.data["citizenship"] == NULL_VALUE]
		rows_with_locals = self.data[self.data["citizenship"] == "locals"]
		rows_with_all.apply(lambda row_with_all: self.get_expat_row(row_with_all, rows_with_locals), axis=1)

	def delete_column(self, column_name):
		self.data = self.data.drop(column_name, 1)

	def convert_language_to_language_group(self):
		self.replace_specific_key_value("language","English (All)","English")
		self.replace_specific_key_value("language", "Spanish (All),Portuguese (All),Italian,German", "European")
		self.replace_specific_key_value("language", "Hindi,Urdu,Bengali,Tamil,Nepali,Punjabi,Telugu,Sinhala", "Indian")
		self.replace_specific_key_value("language", "Indonesian,Filipino,Malayalam,Thai", "English")

	def process_data(self):
		self.convert_language_to_language_group()
		self.check_not_permitted_empty_values()
		self.replace_null_values()
		self.replace_specific_key_value("gender", 1, "Male")
		self.replace_specific_key_value("gender", 2, "Female")
		self.replace_specific_key_value("gender", 2, "Female")
		self.replace_specific_key_value("gender", 2, "Female")
		self.delete_specific_key_value("gender", 0)
		self.replace_specific_key_value("scholarity", "HIGH_SCHOOL,UNSPECIFIED,SOME_HIGH_SCHOOL", "ND")
		self.replace_specific_key_value("scholarity", "UNDERGRAD,HIGH_SCHOOL_GRAD,SOME_COLLEGE,ASSOCIATE_DEGREE,PROFESSIONAL_DEGREE", "HS")
		self.replace_specific_key_value("scholarity", "ALUM,IN_GRAD_SCHOOL,SOME_GRAD_SCHOOL,MASTER_DEGREE,DOCTORATE_DEGREE","GRAD")
		self.delete_specific_key_value("scholarity", NULL_VALUE)
		self.replace_specific_key_value("exclusion_behavior",6015559470580, "locals")
		self.rename_column("exclusion_behavior", "citizenship")
		self.insert_expats_native_rows()
		self.delete_specific_key_value("is_denominator", True)
		self.delete_column("experiment_id")
		self.delete_column("interest_id")
		self.delete_column("interest")
		self.delete_column("interest_query")
		self.delete_column("ground_truth_column")
		self.rename_column("analysis_name", "interest")
		self.insert_age_range_column()
		self.check_data_integrity()

	def save_file(self,filename):
		self.data.to_csv(filename)



	def __init__(self, filepointer):
		self.data = self.get_pandas_dataset_from_file(filepointer)

if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument('--input', help='JSON Query File')
	args = parser.parse_args()
	if args.input:
		filepointer = open(args.input, "r")
		pd_dataset = PandasDataset(filepointer)
		pd_dataset.process_data()
		pd_dataset.save_file("googlefusion.csv")
	else:
		raise Exception("No input data")
