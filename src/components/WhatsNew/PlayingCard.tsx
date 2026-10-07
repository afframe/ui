/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: the unused React import and an eslint-disable comment for a plugin this repo does not use dropped. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

interface iPlayingCard {
  label: string;
}
const PlayingCard = ({ label }: iPlayingCard) => {
  //

  return (
    <div className="PlayingCard">
      <div style={{ position: 'absolute', top: 16, left: 16 }}>{label}</div>
      <div style={{ position: 'absolute', bottom: 16, right: 16 }}>{label}</div>
    </div>
  );
};

export { PlayingCard };
