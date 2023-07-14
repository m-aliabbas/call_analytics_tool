def extract_phrases(input_dict):
    output_dict = {}
    for key, value in input_dict.items():
        inner_key = next(iter(value))
        output_dict[key] = value[inner_key]
    return output_dict


    