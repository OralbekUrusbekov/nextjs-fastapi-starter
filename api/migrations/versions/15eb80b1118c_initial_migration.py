"""Initial migration

Revision ID: 15eb80b1118c
Revises: a7da0e305911
Create Date: 2024-12-11 11:30:39.044064

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '15eb80b1118c'
down_revision: Union[str, None] = 'a7da0e305911'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('catalogs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.Column('information', postgresql.ARRAY(sa.String()), nullable=False),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('location', sa.String(), nullable=False),
    sa.Column('rating', sa.Float(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_catalogs_id'), 'catalogs', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_catalogs_id'), table_name='catalogs')
    op.drop_table('catalogs')
    # ### end Alembic commands ###
