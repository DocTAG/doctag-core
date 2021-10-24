#
# IcLogger
#
# Author: Fabio Giachelle <giachelle.fabio@gmail.com>
# URL: <http://nltk.org/>
# License: MIT

"""
IcLogger

This module provides logging functions leveraging on the https://github.com/gruns/icecream python library.

"""

from icecream import ic


class IcLogger:
    def __init__(self, print_status=True):
        self.print_status = print_status

        if not print_status:
            ic.disable()
        else:
            ic.enable()

    def log(self, *args):
        """Log arguments passed using the icecream library.

        Parameters
        ----------
        *args : list
            list of arguments to log
        """
        if self.print_status:
            ic.enable()
            ic(args)
            ic.disable()

    def get_status(self):
        """Return the current status of the logger.
        """
        return self.print_status

    def set_status(self, status):
        """Set the new status of the logger.

        Parameters
        ----------
        status : boolean
            new status for the logger.
        """
        self.print_status = status

    @staticmethod
    def print(*args):
        """Static method that prints always the arguments passed.

         Parameters
        ----------
        *args : list
            list of arguments to log
        """
        ic.enable()
        ic(args)
        ic.disable()
