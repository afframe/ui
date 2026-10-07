/**
 * Copyright IBM Corp. 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript (props typed instead of propTypes), TextInput from @afframe/ui. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ChangeEvent } from 'react';
import { TextInput } from '../../../index.js';

type CustomInputProps = {
  /**
   * current condition state
   */
  conditionState: { value?: string };
  /**
   * This function need to be called that provides a label which should be shown in the condition after a user has made their selection / set their value
   */
  onChange: (value: string) => void;
};

const CustomInput = ({ onChange, conditionState }: CustomInputProps) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  return (
    <div className={`custom-component`}>
      <TextInput
        labelText={'labelText'}
        hideLabel
        value={conditionState.value ?? ''}
        id={'customInput'}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default CustomInput;
